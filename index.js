// const Twit = require("twit");
const { getSongById } = require("genius-lyrics-api");
require("dotenv").config();
// const CronJob = require("cron").CronJob;
const fetch = require("node-fetch");

/*
NOTES:
    The list of song IDs should wipe and re-generate weekly, so as to avoid
    missing any releases.

    getAllSongs returns a promise - PLEASE remember to .then() the result.
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

    async getAllSongs() {
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
        return song_list;
    }

    async getRandomLyrics() { // Broken?
        return getSongById(getRandomSongID(this.id), process.env.GENIUS_ACCESS_TOKEN)
            .then((song) => console.log(song.lyrics))
    }
}

// Define all of the artists the bot will randomly pick
const Milo = new Artist(3158);
const RAPFerreira = new Artist(1840820)

// Function for selecting a random song ID from an artist
function getRandomSongID(artist) {
    artist.getAllSongs() // Broken?
        .then(list => {
            const random = Math.floor(Math.random() * list.length)
            return list[random]
        })
}
