const Twit = require("twit");
require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const { getSongById } = require("genius-lyrics-api");


// Create a list of Genius Artist IDs to pick from
    const artist_ids = [3158, 96862, 1840820]; // Milo, Scallops Hotel, R.A.P. Ferreira

// Load the JSON file artist_song_ids.json
    let song_ids = require("./artist_song_ids.json");

// Select a random Artist ID from the list artist_ids
    let random_artist = artist_ids[Math.floor(Math.random() * artist_ids.length)];

// Get a random song ID from the list of song IDs for the randomly-picked artist
    let random_song = song_ids[random_artist][Math.floor(Math.random() * song_ids[random_artist].length)]

// Grab the lyrics
let song_lyrics;
getSongById(random_song, process.env.GENIUS_ACCESS_TOKEN)
    .then((song) => song_lyrics = song.lyrics)
