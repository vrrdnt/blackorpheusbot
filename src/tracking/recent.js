// A database costs money, and I don't want to spend money, so I'm gonna use JSON instead :-)

const fs = require("fs")

function saveRecent(tweet, target) {

    target.push(tweet)

    while (target.length > 15) {
        target.shift()
    }

    fs.writeFileSync("./src/tracking/recent_posts.json", JSON.stringify(target))
}

function loadRecents() {
    let rawdata = fs.readFileSync("./src/tracking/recent_posts.json");
    return JSON.parse(rawdata)
}

module.exports = {
    saveRecent,
    loadRecents
}
