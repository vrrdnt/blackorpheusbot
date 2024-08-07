const dotenv = require("dotenv").config();

const Genius = require("genius-lyrics");
const geniusClient = new Genius.Client(process.env.GENIUS_ACCESS_TOKEN);
const { TwitterApi } = require("twitter-api-v2");
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_KEY_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

async function getArtistInfo(id) {
  let artist = await geniusClient.artists.get(id);
  console.log("About the Artist:\n", artist, "\n");
  return artist;
}

/**
 * Returns a list of songs matching the artist name list
 * @param {Number} id ID of desired artist on Genius
 * @param {Array} array List of artist names
 * @returns {Array} List of songs matching named artists
 */
async function getArtistSongs(id, artists) {
  let artist = await getArtistInfo(id);
  let batch = [];
  for (let i = 1; i !== 0; i++) {
    let songs = await artist.songs({
      page: i,
      perPage: 50,
      sort: "title",
    });
    if (songs.length === 0) break;
    console.log(`Songs: ${songs.length}`);
    for (let song of songs) {
      if (artists.includes(song.artist.name)) {
        batch.push(song);
      }
    }
  }
  return batch;
}

(async () => {
  const songs = await getArtistSongs(1840820, process.env.artists);
  let song = songs[Math.floor(Math.random() * songs.length)];
  let lyrics = await song.lyrics();
  let title = song.fullTitle;

  // TODO: keep only rory's verse(s) if others exist

  if (lyrics.contains(`[Verse 1: ${process.env.artists}`))
    console.log(`${lyrics}\n${title}`);
})();
