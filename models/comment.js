const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const tweetCommentSchema = new Schema({
    user: String,
    comment: String,
    createdAt: Date,
    tweetId: ObjectId // on récupére l'ID tweetId
});

// on créé un model de notre tweet (attention la collection doit être égal au nom de notre model au pluriel !!)
module.exports = mongoose.model('comment', tweetCommentSchema);