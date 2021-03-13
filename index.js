// const Twit = require("twit");
// const { getSongById } = require("genius-lyrics-api");
require("dotenv").config();
// const CronJob = require("cron").CronJob;
const fetch = require("node-fetch");

/*
NOTES:
    Verify the "response": { "songs": [ x{ "primary_artist": { "id" } } } is the same as the artist's Genius code.
    This filters most features - desired features may be hardcoded?

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
        // the loop is ended when { "response": { "next_page" } } is null

        // Instantiate variable for list of IDs
        let song_list = [];

        // Instantiate condition of while loop with truthy value
        let search = true;
        let pagination = 1;

        while (search) {
            fetch(`https://api.genius.com/artists/${this.id}/songs?per_page=50&page=${pagination}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
                    },
                }
            )
                .then((res) => res.json())
                .then((json) => {
                    // Update search and next_page, first
                    if (!json["response"]["next_page"]) {
                        search = false;
                    } else {
                        pagination = json["response"]["next_page"];
                        // Loop through songs and add their IDs to the list
                        for (const song in json["response"]["songs"]) {
                            song_list.push(json["response"]["songs"][song].id);
                        }
                    }
                });
        }
        return song_list;
    }
}

// Define all of the artists the bot will randomly pick
const Milo = new Artist(3158);
// const RAPFerreira = new Artist(1840820)

console.log(Milo.getAllSongs());