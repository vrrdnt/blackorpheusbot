const cron = require('node-cron');
const scheduler = require('../classes/Scheduler.js')
const config = require('../../config.js');

const tweetSchedule = cron.schedule(config.tweet_schedule, () => {
    scheduler.emit('scheduledTweet');
}, { scheduled: false });

module.exports = tweetSchedule;