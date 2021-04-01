const Twit = require("twit");
const { getSongById } = require("genius-lyrics-api");
require("dotenv").config();
// const CronJob = require("cron").CronJob;
const fetch = require("node-fetch")


const artist_ids = [3158, 96862, 1840820] // Milo, Scallops Hotel, R.A.P. Ferreira

async function storeAllSongs(id) {
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
        const response = await fetch(`https://api.genius.com/artists/${id}/songs?per_page=50&page=${pagination}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.GENIUS_ACCESS_TOKEN}`,
            },
        })
        const data = await response.json()

        const next_page = data["response"]["next_page"]

        if (!next_page) {
            search = false
        } else {
            pagination = next_page
        }

        const songs = data["response"]["songs"]

        for (const song in songs) {
            if (songs[song]["primary_artist"]["id"] === id) {
                song_list.push(songs[song]["id"])
            }
        }
    }
    return song_list
}

storeAllSongs(96862)
    .then(result => console.log(result))