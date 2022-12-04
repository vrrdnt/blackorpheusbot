const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const config = require('./config.js');

const { getSongById } = require('genius-lyrics-api');

const { TwitterApi } = require('twitter-api-v2');
const twitterClient = new TwitterApi({ 
    appKey: config.twitter_api_key,
    appSecret: config.twitter_api_key_secret,
    accessToken: config.twitter_access_token, 
    accessSecret: config.twitter_access_token_secret });

const scheduler = require("./src/classes/Scheduler.js");

const tweetSchedule = require('./src/schedules/tweet.js');
const syncSchedule = require('./src/schedules/sync');

scheduler.on('scheduledTweet', async () => {
    // grab random song from song list
    const songList = require('./songs.json');
    const song = songList[Math.floor(Math.random() * songList.length)];

    // get lyrics
    let response = await getSongById(song, config.genius_access_token);
    if(!response.lyrics) { return scheduler.emit('scheduledTweet'); }

    // clean/prepare text
    response.lyrics = response.lyrics.split(/\n/);

    function cleanLyrics(bar) {
        return !bar.startsWith('[') && !bar.includes('?') && !/[Xx]\d/.test(bar)
    }

    let lyrics = response.lyrics.filter(cleanLyrics);
    lyrics = lyrics.map(bar => bar.charAt(0).toLowerCase() + bar.substr(1));
    lyrics = lyrics.map(bar => bar.replace(/ I /, ' i '));

    // get random bars
    const batch = [];
    const randomIndex = Math.floor(Math.random() * lyrics.length - 2)
    batch.push(lyrics[randomIndex], lyrics[randomIndex + 1], lyrics[randomIndex + 2])

    // check if selected bars exist in recent tweets, redo above if so
    // TODO: IMPLEMENT THIS

    // send tweet
    await twitterClient.v1.tweet(batch.join('\n'));

    // add tweet to recent tweets list
    // TODO: IMPLEMENT THIS TOO
});

scheduler.on('scheduledSync', async () => {
    let song_list = [];

    for (const artist of config.artists) {
        let page = 1;
        let loop = true;

        while (loop) {
            const response = await fetch(`https://api.genius.com/artists/${artist}/songs?per_page=50&page=${page}`, {
                    method: "GET",
                    headers: { Authorization: `Bearer ${config.genius_access_token}` },
                })

                const data = await response.json()
                let songs = data["response"]["songs"];
                let next_page = data["response"]["next_page"];

                songs.forEach(song => {
                    if (!song["primary_artist"]["id"] === artist) return
                    song_list.push(song["id"])
                });

                if (!isNaN(next_page)) {
                    loop = false;
                } else {
                    page = next_page;
                }
            }
    }

    fs.writeFileSync(path.join(__dirname, 'songs.json'), JSON.stringify(song_list));
});

// download song list if it doesn't exist at runtime
if (!fs.existsSync(path.join(__dirname, 'songs.json'))) { scheduler.emit('scheduledSync') };

tweetSchedule.start();
syncSchedule.start();
