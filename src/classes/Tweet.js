const twitterBot = require("./twitter.js");
const path = require("path");
const fs = require('fs');
const fetch = require('node-fetch');
const ArtistSet = require("./ArtistSet.js");

class Tweet {
    constructor(contents, song_name, ) {
        this.contents = contents;
        this.song_name = song_name;
    }

    sendTweet(contents=this.contents) {
        twitterBot.post('statuses/update', {
            status: contents
        },
        function(error) {
            if (!error) return
            console.log(`There was an error: \n${error}`); 
        });
        }

    updateName(song_name) {
        if (!song_name) return
        twitterBot.post(`account/update_profile`, { "name": song_name.splice(0, 47) + "..." }, function (err) {
            if (err) return console.error(err);
        })
    }

    async updateProfileImage(extension="") {
        twitterBot.postMediaChunked({ file_path: path.join(__dirname, "../../", `image.${extension}`)}, function (err) {
            if (err) return console.error(err);
          })
        twitterBot.post(`account/update_profile_image`, { image: fs.readFileSync(path.join(__dirname, "../../", `image.${extension}`)).toString("base64") }, function (err) {
            if (err) return console.error(err);
        });
    }
}

module.exports = Tweet;