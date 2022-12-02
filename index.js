require("dotenv").config();
const ArtistSet = require("./src/classes/ArtistSet.js");

const artist_set = new ArtistSet(3158, 96862, 1840820);

async function main() {
    await artist_set.fetchSongs();

    const random_song = artist_set.randomSong();
    const id = random_song[0];
    const title = random_song[1];

    const url = await artist_set.download(id)

    const random_set = artist_set.randomSet();

    const tweet = new Tweet(artist_set.song_object.name);

    tweet.sendTweet(random_set.join("\n"));
}

main();