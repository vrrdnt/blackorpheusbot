require("dotenv").config();

const { getSongById } = require("genius-lyrics-api");
const fetch = require('node-fetch');
const twitterBot = require("./src/twitter.js");
const fs = require('fs');
// import { loadRecents, saveRecents } from './src/tracking/recent.js';

const config = require("./config.js");
const path = require("path");

class Tweet {
    constructor(contents) {
        this.contents = contents;
    }

    sendTweet(contents=this.contents) {
        twitterBot.post('statuses/update', {
            status: contents
        },
        function(error) {
            if (!error) return
            console.log(`There was an error: \n${error}`); 
        });
        }

    updateName(song_name=null) {
        if (!song_name) return
        twitterBot.post(`account/update_profile`, { "name": song_name }, function (err) {
            if (err) return console.error(err)
        })
    }
}

class ArtistSet {

    // 3158 Milo
    // 96862 Scallops Hotel
    // 1840820 R.A.P. Ferreira
    // 1544550 Nostrum Grocers

    // Individual songs to block
    // 6393069, 

    constructor(...rest) {
        this.artist_ids = [...rest];
        this.discography = [];
        this.song_object = {
            lyrics: []
        }
    }
    
    async fetchSongs(artists=this.artist_ids) {
        for (const artist of artists) {
            let page = 1;
            let response_collector = [];
            let response_song_collector = [];
            let loop = true;
            while (loop) {
                const response = await fetch(`https://api.genius.com/artists/${artist}/songs?per_page=50&page=${page}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
                        },
                    })
    
                    const data = await response.json()
                    let songs = data["response"]["songs"];
                    let next_page = data["response"]["next_page"];
    
                    response_song_collector.push(JSON.stringify(data, null, 4))
    

                    for (const song in songs) {
                        response_collector.push([songs[song]["id"], songs[song]["title"]])
                    }
    
                    if (!next_page) {
                        loop = false;
                        return this.discography = response_collector.map(song => (song));
                    } else {
                        page = next_page;
                    }
                }
        }
    }

    async download(id=0) {
        if (!id) return console.error("No ID supplied.")
        let try_again = true;
        while (try_again) {
            const song_object = await getSongById(id, process.env.GENIUS_ACCESS_TOKEN);
            if(song_object.lyrics) {
                try_again = false;
            }
        
            this.song_object = song_object;
        }

        this.song_object.lyrics = this.song_object.lyrics.split("\n")

        for (let i = this.song_object.lyrics.length - 1; i >= 0; i--) {
            if (this.song_object.lyrics[i].charAt(0) === '[' || 
            this.song_object.lyrics[i].charAt(0) === '' ||
             this.song_object.lyrics[i].charAt(0) === '(') {
                this.song_object.lyrics.splice(i, 1);
            }
        }
    }

    random() {
        return this.discography[Math.floor(Math.random() * this.discography.length)];
    }
}

const test_artist = new ArtistSet(3158, 96862, 1840820, 1544550);

async function main() {
    await test_artist.fetchSongs();

    const random_song = test_artist.random();
    const id = random_song[0];
    const title = random_song[1];

    await test_artist.download(id)

    const tweetObject = new Tweet("test")
    console.log(test_artist.song_object.lyrics);
}

main();

// TODO: Pre-generate a tweet and DM it to vrrdnt. Allow a "yes" or "no" response to post the tweet,
// or block that song ID from entering the available song pool
// Disallow lines past a certain length (280 for max tweet length, aim to cut off at closest sentence)