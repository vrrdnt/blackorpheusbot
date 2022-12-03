// emit a sync event to index
// a cron job will sit here
// need to read up on node:events

const cron = require('node-cron');

module.exports = {
    name: 'scheduledSync',
    execute(bot) {
        // schedule here, i think
    }
}