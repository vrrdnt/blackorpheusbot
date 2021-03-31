const Twit = require("twit");
const { getSongById } = require("genius-lyrics-api");
require("dotenv").config();
// const CronJob = require("cron").CronJob;
const fetch = require("node-fetch");

/*
NOTES:

    For anyone viewing on GitHub, I know how bad this code is.
    I wanted it to be clean at first, but now I just want it to work.
    I work 50 some hours a week and just want this bot done bro

    The list of song IDs should wipe and re-generate weekly, so as to avoid
    missing any releases.

    getAllSongs returns a promise - PLEASE remember to .then() the result.
 */

// A class for Artists containing an ID
class Artist {
    constructor(id) {
        this.id = id;
        this.song_list = []
    }

    async storeAllSongs() {
        // Use a while loop to add song IDs to an array.
        // The condition of the while loop must be dependent on the value of a variable that
        // is instantiated as something truthy, but is then
        // updated by the result of a GET to /artists/:id/songs, where
        // the loop is ended when { "response": { "next_page" } } is null

        // Instantiate variable for list of IDs
        let song_list = [];

        // Instantiate condition of while loop with truthy value
        let search = true;
        let pagination = 1;

        while (search) {
            const response = await fetch(`https://api.genius.com/artists/${this.id}/songs?per_page=50&page=${pagination}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
                },
            })
            const data = await response.json()

            if (!data["response"]["next_page"]) {
                search = false
            } else {
                pagination = data["response"]["next_page"]

                for (const song_item in data["response"]["songs"]) {
                    if (data["response"]["songs"][song_item]["primary_artist"]["id"] === this.id) {
                        song_list.push(data["response"]["songs"][song_item]["id"])
                    }
                }
            }
        }
        return this.song_list = song_list
    }

    logAllSongs() {
        return console.log(this.song_list);
    }
}

// Define all of the artists the bot will randomly pick

// Milo
let Milo = new Artist(3158);
Milo.storeAllSongs().then()

// Scallops Hotel
let ScallopsHotel = new Artist(96862);
ScallopsHotel.storeAllSongs().then()

// R.A.P. Ferreira
let RAPFerreira = new Artist(1840820);
RAPFerreira.storeAllSongs().then()

// Build Twitter API client
const twitterBot = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_KEY_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
