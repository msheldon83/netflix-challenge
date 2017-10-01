import App from '../src/server/app.js'
import Repository from '../src/server/repository.js'
import Resolver from '../src/server/resolver.js'
import FireHose from '../src/server/fireHose.js'

const express = require("express");
const path = require ("path");
const open = require("open");
const sse = require('../src/middleware/sse');

// Express setup
const port = 3000;
const app = express();
app.use(sse);


// App logic setup
const repository = new Repository();
const fireHose = new FireHose(new Resolver(repository));
const appLogic = new App(repository, fireHose);


// ROUTES

// Index.html
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.get('/sessionId', function(req, res){
    res.send( req.sessionId);
})

// Establish a stream connection 
app.get('/connection', function(req, res){
    let sid = req.sessionId;
    res.sseSetup();
    repository.addConnection(res, sid);
});

// Get the list of queries this session is watching
app.get('/connection/queries', function(req, res){
    
});

// Post a new query
app.post('/connection/queries', function(req, res){
    
});

// Delete a query
app.delete('/connection/queries', function(req, res){
    
});



// Start Listening
app.listen(port, function(err){
    if(err){
        console.log(err);
    } else {
        open('http://localhost:' + port);
    }

});