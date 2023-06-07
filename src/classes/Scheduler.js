const { EventEmitter } = require('events');

class Scheduler extends EventEmitter {}

const scheduler = new Scheduler();

module.exports = scheduler;

