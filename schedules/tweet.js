// emit a tweet event to index here
// a cron job will sit here
// need to read up on node:events
const cron = require('node-cron');

module.exports = {
    name: 'scheduledTweet',
    execute(bot) {
        // schedule here, i think
    }
}