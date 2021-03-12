const Twit = require("twit");
const { getLyrics } = require("genius-lyrics-api");
require("dotenv").config();
const CronJob = require("cron").CronJob;

const discography = {
    "milo": [
        "mythbuilding exercise no.9",
        "tiptoe",
        "nominy",
        "pure scientific intelligence",
        "failing the stress test",
        "mid answer trying to remember what the question is",
        "lowcoup",
        "aubergine cloak",
        "galahad in goosedown",
        "deposition regarding the green horse for rap",
        "romulan ale",
        "thinking while eating a handful of almonds",
        "stet",
        "the esteemed saboteur reggie baylor hosts an evening at the scallops hotel",
        "sanssouci palace (4 years later)",
        "poet (black bean)",
        "landscaping",
        "call + form (picture)",
        "magician (suture)",
        "the young man has a point (nurture)",
        "pablum // CELESKINGIII",
        "note to mrs",
        "paging mr. bill nunn",
        "sorcerer",
        "take advantage of the naysayer",
        "idk",
        "yet another",
        "ornette's swan song",
        "embroidering machine",
        "rapper (ft. busdriver)",
        "worlds to run",
        "rabblerouse",
        "souvenir",
        "zen scientist",
        "re: animist",
        "an encyclopedia",
        "going no place",
        "true nen (ft. open mike eagle)",
        "napping under the echo tree",
        "@yomilo",
        "salladhor saan, smuggler",
        "yafet's song",
        "peanut butter sandwiches",
        "sanssouci palace",
        "in gaol",
        "thatness and whatness",
        "fragrant pee farts",
        "ought implies can + i cannot",
        "you are go(o)d to me",
        "objectifying rabbits",
        "argyle sox",
        "buck 65's knee",
        "just us (a reprise for robert who has not been forgotten)",
        "a day trip to the nightosphere",
        "may the days be aimless",
        "gaudeamus igitur",
        "geometry and theology",
        "sophistry and illusion",
        "red oleanders",
        "besos",
        "ba'al chiliagon swords",
        "i am am",
        "ecclesiastes",
        "sweet chin music",
        "almost cut my hair (for crosby)",
        "folk-metaphysics",
        "legends of the hidden temple",
        "almond milk paradise",
        "kenosha, wi",
        "a lazy coon's obiter dictum",
        "the gus haynes cribbage league",
        "monologion",
        "folk-metaphysics",
        "post hoc ergo propter hoc",
        "the otherground pizza party",
        "prop joe's clock repair shop",
        "the confrontation at khazad-dum",
        "the ballad of mermaid man and barnacle boy",
        "lester freamon toe-taps the blues",
        "prince abakaliki of nigeria needs your help",
        "atlas flushed (grumpy groucho marxist response)",
        "hall 2 with will's singing untouched",
        "the mumblings of mr wav",
        "omar don't scare",
        "just us",
        "one lonely owl",
        "the thief of always",
        "sanguine spin cycles",
        "budding ornithologists are weary of tired analogies",
        "super happy sunshine fun club",
        "mr. doubt(w)riter",
        "backpacker's sermon from mount jansport",
        "vinz clortho meets zuul",
        "david foster wallace",
        "for the unheard proboard warriors",
        "behold! there appeared a chariot of fire",
        "bill murray's prayer",
    ],
    "r.a.p. ferreira": [
        "stressrunstheworld",
        "vogueship",
        "baby",
        "export the conundrum",
        "animatronics",
        "dreams",
        "nearly there",
        "big business",
        "dipthungsumdim",
        "junction",
        "chamber music",
        "shinin",
        "speck",
        "decorum",
        "greens",
        "noncipher",
        "omens & totems",
        "u.d.i.g. (united defenders of international goodwill)",
        "laundry",
        "dust up",
        "cycles",
        "absolutes",
        "no starving artists",
        "leaving hell",
        "doldrums",
        "an idea is a work of art",
        "mythical",
        "pinball",
        "golden sardine",
        "ro talk",
        "masterplan",
        "respectdue",
        "battle report",
        "the cough bomber's return",
        "yamships, flaxscript",
        "diogenes on the auction block",
        "redguard snipers",
        "sips of ripple wine",
        "skrenth",
        "bobby digital's little wings",
        "listening",
        "high rise in newark",
        "rejoice",
        "abomunist manifesto",
    ],
};

const twitterBot = new Twit({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_KEY_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

function geniusRequest(title, artist) {
    return getLyrics({
        title: title,
        artist: artist,
        apiKey: process.env.GENIUS_ACCESS_TOKEN,
        optimizeQuery: true,
    });
}

async function randomLine(title, artist) {
    let str = "";
    str += await geniusRequest(title, artist);
    const array = str.split("\n"); // what kinda hacky shit is this? fix in the future
    const random = Math.floor(Math.random() * array.length);
    if (!array[random].startsWith("[")) {
        return array[random];
    } else {
        return array[random - 1];
    }
}

function randomArtist() {
    const artistRandom = Math.round(Math.random());
    if (!artistRandom) {
        return "milo";
    } else {
        return "r.a.p. ferreira";
    }
}
async function makeTweet(title, artist) {
    twitterBot.post(
        "statuses/update",
        { status: randomLine(title, artist) },
        function (error, data, response) {
            if (error) {
                console.log(error);
            }
        }
    );
}

// const job = new CronJob('*/15 * * * *', function() {
//     let randomSelection = randomArtist()
//     makeTweet(discography[randomSelection][Math.floor(Math.random() * randomSelection.length)]);
// }, null, true, 'America/Los_Angeles');
// job.start();

let randomSelection = randomArtist();

console.log(`Artist: ${Object.keys(discography)[Object.keys(discography).indexOf(randomSelection)]}`)
console.log(`Song: ${discography[randomSelection][Math.floor(Math.random() * discography[randomSelection].length)]}`)
// makeTweet(discography[randomSelection][Math.floor(Math.random() * discography[randomSelection].length)])
