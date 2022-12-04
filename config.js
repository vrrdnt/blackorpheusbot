module.exports = {
    twitter_bearer_token: 'AAAAAAAAAAAAAAAAAAAAAH3UjwEAAAAAZsCg2h%2Fgu%2Bo8e4oh60O8RtQdrmk%3DmkKzg1TalDB2LETmjpnhohixKqQM4pR8c8273qJPw4bbfhaHHe',
    genius_access_token: 'zxIo5TR9s-vAb0lYIG7Wlxq4cZdw0lSOc7CdRvlCsIQEml9jms68zuuzeINrgk78',
    artists: ['3158', '96862', '1840820'], // list of strs or str
    tweet_schedule: '0 10-16/2 * * *', // every at minute 0 past every 2nd hour from 10 through 16
    cache_interval: '0 0 * * *', //every day at midnight
    avoid_repeats: true, // compare against recent tweets, restart process if selected bars are contained in recent tweet
    repeat_lookback: 10 // how many tweets to store and compare against
}