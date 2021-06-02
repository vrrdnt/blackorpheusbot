const fs = require("fs")

function saveRecent(tweet, target) {

    // Add the generated tweet to the end of the recents list
    target.push(tweet)

    // Shorten the list of tweets until its length is 15, removing entries at the beginning of the list
    while (target.length > 15) {
        target.shift()
    }

    // Write the new list to the JSON file
    fs.writeFileSync("./src/tracking/recent_posts.json", JSON.stringify(target))
}

function loadRecents() {

    // Load the JSON file
    let rawdata = fs.readFileSync("./src/tracking/recent_posts.json");

    // Return the list as a JS object
    return JSON.parse(rawdata)
}

module.exports = {
    saveRecent,
    loadRecents
}
