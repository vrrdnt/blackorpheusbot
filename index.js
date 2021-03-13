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
        Milo: 12
        R.A.P. Ferreira: 4

    IMPORTANT:
        Verify the "response": { "songs": [ x{ "primary_artist": { "id" } } } is the same as the artist's Genius code.
        This filters most features - desired features may be hardcoded

        In const options, path must be specified as a Genius endpoint.
        Do this programatically, please!

        The list of song IDs should wipe and re-generate weekly, so as to avoid
        missing any releases.
 */

/*
TODO: Get a list of song IDS for every artist, and save them somewhere.
TODO: use genius-lyrics-api on a random song ID to grab all lyrics for that song.
 */

// A class for Artists containing an ID
class Artist {
    constructor(id) {
        this.id = id;
    }

    getAllSongs() {
        // Use a while loop to add song IDs to an array.
        // The condition of the while loop must be dependent on the value of a variable that
        // is instantiated as something truthy, but is then
        // updated by the result of a GET to /artists/:id/songs, where
        // the loop is ended when { "response": { "next_page" } } is NULL
    }
}

// Define all of the artists the bot will randomly pick
const Milo = new Artist(3158)
const RAPFerreira = new Artist(1840820)

// Function that generates an https request with options, where the argument is the endpoint or path.
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

// Example function for getting song lyrics by song ID.
getSongById(85227, process.env.GENIUS_ACCESS_TOKEN)
    .then((song) => console.log(song.lyrics))

// const twitterBot = new Twit({
//     consumer_key: process.env.TWITTER_API_KEY,
//     consumer_secret: process.env.TWITTER_API_KEY_SECRET,
//     access_token: process.env.TWITTER_ACCESS_TOKEN,
//     access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
// });


