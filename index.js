const { bot } = require("./src/classes/bot.js"); // why. what goes in here

const schedulesPath = path.join(__dirname, 'schedules');
const scheduleFiles = fs.readdirSync(schedulesPath).filter(file => file.endsWith('.js'));

for (const scheduleFile of scheduleFiles) {
    const schedulePath = path.join(schedulesPath, scheduleFile);
    const schedule = require(schedulePath);
    
    bot.on(schedule.name, (...args) => schedule.execute(...args)) // iffy. don't let this confuse you
}

bot.on('scheduledTweet', function(err) {
    // grab random song from song list
    // get lyrics, get random bars
    // check if selected bars exist, redo above if so
    // clean/prepare text, send tweet
    // add tweet to recent tweets list
});

bot.on('scheduledSync', function(err) {
    // for each artist, use genious api to pull all songs (paginated)
    // replace existing song list with new results
});