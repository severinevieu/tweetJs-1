const express = require('express');
const TweetController = require('../controllers/tweet.controller');

const tweetController = new TweetController();
const router = express.Router();

router.get('/tweets', async (req, res) => {
    tweetController.getAll(req, res);
});

router.get('/tweets/new', async (req, res) => {
    res.render('new');
});

router.get('/tweets/:id', async function (req, res) {
    tweetController.get(req, res);
});

router.post('/tweets', async (req, res) => {
    tweetController.create(req, res);
});

module.exports = router;
