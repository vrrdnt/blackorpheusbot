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

    async getRandomLyrics() {
        await this.getAllSongs()
            .then(list => {
                const random = Math.floor(Math.random() * list.length)
                getSongById(list[random], process.env.GENIUS_ACCESS_TOKEN)
                    .then(song => {
                        return song.lyrics
                    })
            })
    }

    async genRandomTweet() {
       await this.getRandomLyrics()
            .then(lyrics => {
                // Split lyrics into an array by line
                const lyrics_array = lyrics.toString().split("\n")

                // Generate array without lines like [Chorus]
                const line_set = lyrics_array.filter(item => !item.includes("[") && !item.includes("\n"))

                // Generate a random number between 1 and 3 to determine how far up/down the bot will crawl
                const random = Math.floor(Math.random() * 3) + 1

                // Generate a new random to decide whether the bot will crawl backwards or forwards
                // 0 is forwards (down the song), 1 is backwards (up the song)
                const random_direction = Math.round(Math.random())

                // Generate a new random to determine a random starting position
                const random_start = Math.floor(Math.random() * line_set.length)

                // Return the string that will get Tweeted
                let base_array = []


                // Add lines to array depending on direction and number of lines
                switch (random_direction) {
                    case 0:
                        for (let i = 0; i < random; i++) {
                            base_array.push(line_set[random_start+i])
                        }
                        break;
                    case 1:
                        for (let i = 0; i < random; i++) {
                            base_array.unshift(line_set[random_start-i])
                        }
                }

                // Return the finished array as a multi-line string
                return base_array.join("\n").toString()
            })
    }


}

// Define all of the artists the bot will randomly pick
const Milo = new Artist(3158);
const RAPFerreira = new Artist(1840820)

// Build Twitter API client
const twitterBot = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_KEY_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

Milo.genRandomTweet()
    .then(s => console.log(s))