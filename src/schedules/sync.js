const cron = require('node-cron');
const scheduler = require('../classes/Scheduler.js')
const config = require('../../config.js');

const syncSchedule = cron.schedule(config.cache_interval, () => {
    scheduler.emit('scheduledSync');
}, { scheduled: false });

module.exports = syncSchedule;