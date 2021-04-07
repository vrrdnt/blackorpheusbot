const Twit = require("twit");
require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const { getSongById } = require("genius-lyrics-api");


// Create a list of unique Genius Artist IDs to pick from
const artist_ids = [3158, 96862, 1840820]; // Milo, Scallops Hotel, R.A.P. Ferreira

// Load the JSON file artist_song_ids.json
let song_ids = require("./artist_song_ids.json");

// Select a random Artist ID from the list artist_ids
let random_artist = artist_ids[Math.floor(Math.random() * artist_ids.length)];

// Get a random song ID from the list of song IDs for the randomly-picked artist
let random_song = song_ids[random_artist][Math.floor(Math.random() * song_ids[random_artist].length)]

// Get random lyrics and tweet them
getSongById(random_song, process.env.GENIUS_ACCESS_TOKEN).then((song) => {
    let bars;
    console.log(song)
    if (song.lyrics != null) {
        let arr = song.lyrics.split("\n");
        for (let i = arr.length - 1; i >= 0; i--) {
            if (arr[i].charAt(0) === "[" || arr[i].charAt(0) === "") {
                arr.splice(i, 1);
            }
        }
        let pos = Math.floor(Math.random() * arr.length-2)
        let bar_rand = Math.random()
        if (bar_rand < 0.33) {
            bars = [
                arr[pos],
                arr[pos+1],
                arr[pos+2]
            ]
        } else if (bar_rand < 0.66 && bar_rand > 0.33) {
            bars = [
                arr[pos],
                arr[pos+1]
            ]
        } else {
            bars = [ arr[pos] ]
        }
        bars = bars.map(line => line.toLowerCase())
        console.log(bars)

        const twitterBot = new Twit({
            consumer_key: process.env.TWITTER_API_KEY,
            consumer_secret: process.env.TWITTER_API_KEY_SECRET,
            access_token: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        });

        twitterBot.post(
            "statuses/update",
            { status: bars.join('\n') },
            function (error, data, response) {
                if (error) {
                    console.log(error);
                }
            }
        );
    }
})
