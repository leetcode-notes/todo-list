#!/bin/env node

// set up ================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');             // log requests to the console
var bodyParser = require('body-parser');    // pull information from HTML POST
var methodOverride = require('method-override');    // simulate DELETE and PUT

var ip = '127.0.0.1';
var port = process.env.PORT || 5000;

// configuration =========================
mongoose.connect(process.env.MONGODB_DB_URL);

app.use(express.static(__dirname + '/public')); // set the static files location
app.use(morgan('dev'));                         // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' }));         // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model ==========================
var Todo = mongoose.model('Todo', {
    text: String,
    done: Boolean
});

// routes and api ========================
// get all todos
app.get('/api/todos', function(req, res){
    Todo.find(function(err, todos){
        if (err)
            res.send(err);
        res.json(todos);    // return all todos in JSON format
    });
});

// create a todo
app.post('/api/todos', function(req, res){
    Todo.create({
        text: req.body.text,
        done: false
    }, function(err, todo){
        if (err)
            res.send(err);
        Todo.find(function(err, todos){
            if (err)
                res.send(err);
            res.json(todos);    // return all todos in JSON format
        });
    });
});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res){
    Todo.remove({
        _id: req.params.todo_id
    }, function(err, todo){
        if (err)
            res.send(err);
        Todo.find(function(err, todos){
            if (err)
                res.send(err);
            res.json(todos);    // return all todos in JSON format
        });
    });
});

// listen ================================
app.listen(port);
console.log('Server app listening on port %d', port);