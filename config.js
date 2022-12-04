module.exports = {
    twitter_api_key: 'aEPx4m2NLHuJwC1cdrQWdjtNj',
    twitter_api_key_secret: '9T8ItZ2za8vczMV9m7tMH9BX7IwtUQf393AsEYN5uCxRqy77Gd',
    twitter_access_token: '1370151080986775552-3epuonkJIA5N65G5ZcCEaLxHLhHg00',
    twitter_access_token_secret: 'FoBts9WgrvycLxOtKf395cUDHhYlgrluJgomYe3IkkdxW',
    genius_access_token: 'V2UodQfdYuNEuCxsxX-lE08uzzJR3eTtfM7Xq-ox37TIOnrylbvcEaPu2m_GL4xN',
    artists: ['3158', '96862', '1840820'], // list of strs or str
    tweet_schedule: '0 10-16/2 * * *', // every at minute 0 past every 2nd hour from 10 through 16
    cache_interval: '0 0 * * *', //every day at midnight
    avoid_repeats: true, // compare against recent tweets, restart process if selected bars are contained in recent tweet
    repeat_lookback: 10 // how many tweets to store and compare against
}