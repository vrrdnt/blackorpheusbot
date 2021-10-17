require("dotenv").config();
const ArtistSet = require("./src/classes/ArtistSet.js");
const Tweet = require("./src/classes/Tweet.js");
// import { loadRecents, saveRecents } from './src/tracking/recent.js';

const config = require("./config.js");
const path = require("path");
const Twit = require("twit");

const artist_set = new ArtistSet(3158, 96862, 1840820, 1544550);

async function main() {
    await artist_set.fetchSongs();

    const random_song = artist_set.randomSong();
    const id = random_song[0];
    const title = random_song[1];

    const url = await artist_set.download(id)

    const random_set = artist_set.randomSet();

    const tweet = new Tweet(artist_set.song_object.name);

    tweet.sendTweet(random_set.join("\n"));

    tweet.updateName(title)

    await tweet.updateProfileImage(url);

}

main();

// TODO: Pre-generate a tweet and DM it to vrrdnt. Allow a "yes" or "no" response to post the tweet,
// or block that song ID from entering the available song pool (need persistent storage, no heroku)

// TODO: Set profile picture to the provided album art on Genius. If the default is the result (or some key in the JSON response
// says something about not having album art) then set it to a default of our choosing.

// TODO: Disallow lines past a certain length (280 for max tweet length, aim to cut off at closest finished sentence)

// TODO: Implement some kind of crawl. No way to clean strings without potentially ruining a tweet.