import App from '../src/server/app.js'
import Repository from '../src/server/repository.js'
import Resolver from '../src/server/resolver.js'
import FireHose from '../src/server/fireHose.js'

const express = require("express");
const bodyParser = require("body-parser");
const path = require ("path");
const open = require("open");
const sse = require('../src/middleware/sse');

// Express setup
const port = 3000;
const app = express();
app.use(sse);
app.use(bodyParser.json());


// App logic setup
const appLogic = new App(
    new Repository(), 
    new FireHose(new Resolver(repository)));


// ROUTES

// Index.html
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.get('/sessionId', function(req, res){
    console.log(req.sessionID);
    res.send(req.sessionID);
})

// Establish a stream connection 
app.get('/connections/:sid', function(req, res){
    res.sseSetup();
    appLogic.addConnection(res, req.params.sid);
});

// Get the list of queries this session is watching
app.get('/connections/:sid/queries', function(req, res){
    res.send(appLogic.getQueries(req.params.sid));
});

// Post a new query
app.post('/connections/:sid/queries', function(req, res){
    res.send(appLogic.addQuery(req.body, req.params.sid));
});

// Delete a query
app.delete('/connections/:sid/queries/:qid', function(req, res){
    res.send(appLogic.removeQueryById(req.params.qid, req.params.sid));
});



// Start Listening
app.listen(port, function(err){
    if(err){
        console.log(err);
    } else {
        open('http://localhost:' + port);
    }

});