const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch');

const scheduler = require("./src/classes/Scheduler.js");

const tweetSchedule = require('./src/schedules/tweet.js');
const syncSchedule = require('./src/schedules/sync');
const config = require('./config.js');

scheduler.on('scheduledTweet', () => {
    // grab random song from song list
    function randomSong() {
        return this.discography[Math.floor(Math.random() * this.discography.length)];
    }

    // get lyrics
    if (!id) return console.error("No ID supplied.")
        let try_again = true;
        let song_object = { lyrics: [] };
        while (try_again) {
            song_object = await getSongById(id, process.env.GENIUS_ACCESS_TOKEN);
            if(song_object.lyrics) {
                try_again = false;
            }
        
            this.song_object = song_object
        }

        this.song_object.lyrics = this.song_object.lyrics.split(/\n/);

        for (let i = this.song_object.lyrics.length - 1; i >= 0; i--) {
            if (this.song_object.lyrics[i].charAt(0) === '[' ||
            this.song_object.lyrics[i].charAt(0) === '' ||
            this.song_object.lyrics[i].includes("?")) { 
                this.song_object.lyrics.splice(i, 1);
            }
            this.song_object.lyrics[i].charAt(0).toLowerCase()
        }

        // get random bars
        function randomSet() {
            const batch = [];
    
            const random = Math.floor(Math.random() * this.song_object.lyrics.length-2)
            
            batch.push(this.song_object.lyrics[random],this.song_object.lyrics[random + 1], this.song_object.lyrics[random + 2])
            
            return batch
        }
    // check if selected bars exist in recent tweets, redo above if so
    // clean/prepare text, send tweet
    // add tweet to recent tweets list
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