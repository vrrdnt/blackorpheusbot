const Twit = require("twit");
const { getSongById } = require("genius-lyrics-api");
require("dotenv").config();
const CronJob = require("cron").CronJob;
const https = require('https')

/*
NOTES:

    GENIUS ARTIST IDS:
        Milo: 3158
        R.A.P. Ferreira: 1840820

    TOTAL SEARCH PAGES (GET /artists/:id/songs):
        Milo:
        R.A.P. Ferreira: 4

    IMPORTANT:
        Verify the "response": { "songs"[x]: { "primary_artist": { "id" } } } is the same as the artist's Genius code.
        This filters most features - desired features may be hardcoded

        In const options, path must be specified as a Genius endpoint.
        Do this programatically, please!
 */

/*
TODO: Get a list of song IDS for every artist, and save them somewhere.
TODO: use genius-lyrics-api on a random song ID to grab all lyrics for that song.
 */

// Somehow get every song ID from each artist and put it into song_ids for a future function to randomly select from.
const song_ids = []

function genOptions(endpoint) {
    return {
        hostname: 'api.genius.com',
        port: 443,
        path: endpoint,
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`
        }
    }
}

console.log(genOptions("/artists/1840820"))

getSongById(85227, process.env.GENIUS_ACCESS_TOKEN)
    .then((song) => console.log(song.lyrics))

// const twitterBot = new Twit({
//     consumer_key: process.env.TWITTER_API_KEY,
//     consumer_secret: process.env.TWITTER_API_KEY_SECRET,
//     access_token: process.env.TWITTER_ACCESS_TOKEN,
//     access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
// });


