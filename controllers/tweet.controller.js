const TweetService = require('../services/tweet.service');
const CommentService = require('../services/comment.service');

class TweetController {
    constructor() {
        this.tweetService = new TweetService();
        this.commentService = new CommentService();
    }

    async create(req, res) {
        const tweet = req.body;

        const created = await this.tweetService.create(tweet);

        res.redirect('/tweets');
    }

    async getAll(req, res) {
        const tweets = await this.tweetService.getAll();

        res.render('tweets', { tweets });
    }

    async get(req, res) {
        const id = req.params.id;

        const tweet = await this.tweetService.get(id);

        if (!tweet) {
            console.error('error tweet not found with id ', id);
            return res.status(404).send();
        }

        const comments = await this.commentService.getByTweetId(id);

        res.render('tweet', { tweet, comments});
    }
}

module.exports = TweetController;
