// on récupére notre router
const commentRouter = require('./routers/comment.router');
// on indique à notre app de l'utiliser
app.use('/', commentRouter);


// on récupére notre dépendance externe - ici express.
const express = require('express');
const logger = require('morgan');
const path = require('path');
/* const tweets = require('./tweets.json');
const { v4: uuidv4 } = require('uuid'); */
const axios = require('axios');
const { response } = require('express');
const connect = require('./database/mongodb');
const Comment = require('./models/comment');

// on supprime la ligne qui importait notre fichier json et celle du uuid ! Mongodb génére automatiquement les ids
const Tweet = require('./models/tweet');
const tweet = require('./models/tweet');

// on construit notre application qui nous servira à créer nos routes
const app = express();
// on donne un port sur lequel notre serveur écoute
const port = 3000;

connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'hbs');
// on indique que nos vues se trouverons toujours dans le dossier views 
app.set('views', path.join(__dirname, 'views'));

// notre première route !
// on envoi un Hello World si la requête est sur la racine.
app.get('/', (req, res) => {
    res.render('index', { name: 'TweetJs' });
});

app.get('/tweets/new', (req, res) => {
    res.render('new');
});

app.get('/tweets', async(req, res) => {
    //Pour retourner un user specifique
    //const tweets = await tweet.find({user:'Ribery'});
    //Pour tout retourner
    const tweets = await tweet.find({}).sort({createdAt: -1});
    res.render('tweets', { tweets });
})

/* Definit dans controler
app.get('/tweets/:id', async (req, res) => {
    const id = req.params.id;
    const tweet = await Tweet.findById(id);
    // ajout comment
    const comments = await getCommentsByTweetId(id);
    const users = await getRandomUsers(3);
    //avant recupération modèle
    // const tweet = tweets.find((elem) => {
    //     return elem.id === id;
    // });
    res.render('tweet', { tweet: tweet, users: users });
}); */

app.post('/tweets', async(req, res) => {
    const paramTweet = req.body;
    //plus besoin avec mongo
    // tweet.id = uuidv4();
    // tweets.push(tweet);
    const tweet = new Tweet({
        title: paramTweet.title,
        content: paramTweet.content,
        user: paramTweet.user,
        createdAt: new Date(),
    });
    await tweet.save();
    res.redirect('/tweets');
});

/* Rediriger dans router
//POST comment dans mongodb
app.post('/api/tweets/:id/comments', async(req, res) => {
    const tweetId = req.params.id;
    const paramComment = req.body;

    //Gestion des erreurs
    let tweet;
    try {
        tweet = await Tweet.findById(tweetId);
    } catch (err) {
        console.error('oops une erreur ', err);
        return res.status(400).send(err.message);
    }

    if (!tweet) {
        console.error('tweet not found !');
        return res.status(404).send();
    }
    
    //création comment
    const comment = new Comment({
        user: paramComment.user,
        comment: paramComment.comment,
        createdAt: new Date(),
        tweetId: tweetId
    });
    const createdComm = await comment.save();
    res.send(createdComm);
}); */

// on écoute sur notre port.
app.listen(port, () => {
    console.log(`TweetJS listening at http://localhost:${port}`)
});


/**
* ma fonction prend en paramètre le nombre d'utilisateur qui sera généré.
* elle est asynchrone !
* @param number
* @return elle retourne un tableau d'utilisateurs
*/
async function getRandomUsers(number) {
    // je construis mon url avec le paramètre
    const url = `https://randomuser.me/api/?results=${number}`;

    let response;
    try {
        // on fait l'appel à l'API avec l'url. Toujours avec le `await`!
        response = await axios.get(url);
    } catch (err) {
        // on catch si il y a une erreur HTTP !
        // pas de réponse du serveur ! 
        if (!err.response) {
            console.error('Unknown error during the request');
            return [];
        }
        // on extrait de la réponse du serveur, le code, le body, et le status
        const { data, status, statusText } = err.response;
        console.error('Error during the request', status, statusText, data);

        // si j'ai une erreur je retourne un tableau vide ici
        return [];
    }

    // je récupére l'objet results de mon body
    const results = response.data.results;

    // ici je construis un nouveau tableau avec le même nombre d'élément que mon tableau.
    // je ne choisis de retourner que ce que j'ai besoin !
    const users = results.map(elem => {

        let politness = 'Monsieur';
        if (elem.gender === 'female') {
            politness = 'Madame';
        }

        return {
            politness: politness,
            firstName: elem.name.first,
            lastName: elem.name.last,
            email: elem.email,
        }
    });

    return users;
}

//GET all comment
async function getCommentsByTweetId(tweetId) {
   return Comment.find({tweetId: tweetId}).sort({createdAt: -1});
}

app.get('/api/tweets/:id/comments', async function (req, res) {
    const tweetId = req.params.id;

    let comments;
    try {
        // on appelle notre fonction que l'on `await`
        comments = await getCommentsByTweetId(tweetId);
    } catch (err) {
        console.error('oops une erreur ', err);
        return res.status(400).send(err.message);
    }

    res.send(comments);
});

