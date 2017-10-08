import App from './app.js'
import Repository from './repository.js'
import {
    Resolver,
    match
} from './resolver.js'
import FireHose from './fireHose.js'
import express from "express"
import bodyParser from "body-parser"
import path from "path"
import sse from './middleware/sse'


// Express setup
const app = express();
app.use(express.static('dist'));
app.use(sse);
app.use(bodyParser.json());


// App logic setup
const netflixUrl = 'https://tweet-service.herokuapp.com/stream'
const repository = new Repository();
const appLogic = new App(
    repository,
    new FireHose(new Resolver(repository), netflixUrl));


// ROUTES


// Index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

// Establish a stream connection 
app.get('/connections/:sid', function (req, res) {
    res.sseSetup();
    appLogic.addConnection(res, req.params.sid);
});

// Get the list of queries this session is watching
app.get('/connections/:sid/queries', function (req, res) {
    res.send(appLogic.getQueries(req.params.sid));
});

// Post a new query
app.post('/connections/:sid/queries', function (req, res) {
    let queryConditions = req.body;
    if (appLogic.validQueryConditions(req.body)) {
        res.send(appLogic.addQuery(req.body, req.params.sid));
    } else {
        res.sendStatus(400);
    }

});

// Delete a query
app.delete('/connections/:sid/queries/:qid', function (req, res) {
    res.send(appLogic.removeQueryById(req.params.qid, req.params.sid));
});

export default app;