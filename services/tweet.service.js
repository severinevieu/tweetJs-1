const Tweet = require('../models/tweet');

class TweetService {
    constructor() { }

    async getAll() {
        return Tweet
            .find({})
            .sort({ createdAt: -1 });
    }

    async create(tweet) {
        const created = new Tweet({
            title: tweet.title,
            content: tweet.content,
            user: tweet.user,
            createdAt: new Date(),
        });
        await created.save();
        return created;
    }

    async get(id) {
        try {
            return Tweet.findById(id);
        } catch (err) {
            console.error('tweet not found !', err);
            return null;
        }
    }
}

module.exports = TweetService;
