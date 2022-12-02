const { TwitterApi } = require('twitter-api-v2');

const twitterBot = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
// const path = require("path");
// const fs = require('fs');
// const fetch = require('node-fetch');
// const ArtistSet = require("./ArtistSet.js");

class Tweet {
    constructor(contents, song_name, ) {
        this.contents = contents;
        this.song_name = song_name;
    }

    sendTweet(contents=this.contents) {
        twitterBot.tweet('statuses/update', {
            status: contents
        },
        function(error) {
            if (!error) return
            console.log(`There was an error: \n${error}`); 
        });
        }
}

module.exports = Tweet;