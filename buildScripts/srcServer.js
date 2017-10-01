import App from '../src/server/app.js'
import Repository from '../src/server/repository.js'
import Resolver from '../src/server/resolver.js'
import FireHose from '../src/server/fireHose.js'

const express = require("express");
const path = require ("path");
const open = require("open");

// Express setup
const port = 3000;
const app = express();

// App logic setup
const repository = new Repository();
const fireHose = new FireHose(new Resolver(repository));
const appLogic = new App(repository, fireHose);


// ROUTES

// Index.html
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

// Establish a stream connection 
app.get('/connection', function(req, res){
    
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