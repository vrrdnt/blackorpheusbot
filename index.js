require("dotenv").config();
const { getSongById } = require("genius-lyrics-api");
const config = require("./config.js");
const twitterBot = require("./src/twitter.js");

// Load the JSON file artist_song_ids.json
let song_ids = require("./src/artist_song_ids.json");

// Select a random Artist ID from the list artist_ids
let random_artist = config.artists[Math.floor(Math.random() * config.artists.length)];

// Get a random song ID from the list of song IDs for the randomly-picked artist
let random_song = song_ids[random_artist][Math.floor(Math.random() * song_ids[random_artist].length)];

function cleanLyrics(song) {

    // If the song is empty or invalid, throw an exception.
    if (!song.lyrics) throw "The song is either empty or invalid.";

    // If the song is an instrumental, throw an exception.
    if (song.lyrics.toLowerCase() === '[instrumental]') throw "Selected song is an instrumental.";

    // Split the lyrics string into an array of strings, split by newline characters
    let lyrics_array = song.lyrics.split('\n');

    // Clean the lyrics, removing any lines starting with a left bracket and empty lines
    for (let i = lyrics_array.length - 1; i >= 0; i--) {
        if (lyrics_array[i].charAt(0) === '[' || lyrics_array[i].charAt(0) === '') {
            lyrics_array.splice(i, 1);
        }
    }

    return lyrics_array;
}

function selectRandomBars(lyrics) {

    // Select a random bar from the lyrics array
    let position = Math.floor(Math.random() * lyrics.length - config.crawl_amount);

    // Construct the base string
    let bars = [lyrics[position]];

    // Select a random number of bars to crawl up through
    let crawl_amount = Math.floor(Math.random() * (config.crawl_amount + 1));

    // Construct a set of bars using a random start position and random crawl amount
    for (let i = 1; i <= crawl_amount; i++) {
        bars.push(lyrics[position + i]);
    }

    // Convert the constructed bars to an all-lowercase string
    bars = bars.map(bar => bar.toLowerCase()).join('\n');

    return bars;
}

try {
    getSongById(random_song, process.env.GENIUS_ACCESS_TOKEN)
        .then((song) => {
            const lyrics = cleanLyrics(song);
            const random_bars = selectRandomBars(lyrics);

            // Post a tweet containing the bars generated earlier
            twitterBot.post('statuses/update', {
                    status: random_bars
                },
                function(error) {
                    if (error) {
                        throw `There was an error: \n${error}`;
                    }
                });
        });
} catch {
    console.log(`There was an error finding the specified song: ${random_song}`);
}