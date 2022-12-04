module.exports = {
    twitter_api_key: '',
    twitter_api_key_secret: '',
    twitter_access_token: '',
    twitter_access_token_secret: '',
    genius_access_token: '',
    artists: [''], // list of strs or str
    tweet_schedule: '0 10-16/2 * * *', // every at minute 0 past every 2nd hour from 10 through 16
    cache_interval: '0 0 * * *', //every day at midnight
    avoid_repeats: true, // compare against recent tweets, restart process if selected bars are contained in recent tweet
    repeat_lookback: 10 // how many tweets to store and compare against
}