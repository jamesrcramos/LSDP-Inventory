// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 53799;                 // Set a port number at the top so it's easy to change in the future

// app.js
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars

app.engine('.hbs', engine({
    extname: ".hbs",
    defaultLayout: 'main',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials'
}));  // Create an instance of the handlebars engine to process templates

app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
app.set('views', 'views');

// Database
var db = require('./database/db-connector')

/*
    ROUTES
*/
// app.js

app.get(['/', '/index'], function(req, res)
    {  
        res.render('index');
    });

app.get('/equipment', function(req, res)
    {
        let query1 = "SELECT * FROM Equipment;"; 
        
        db.pool.query(query1, function(error, rows, fields){
            res.render('equipment', {data: rows});                 
        })   
    });

app.get('/components', function(req, res)
    {
        let query2 = "SELECT * FROM Components;"; 
        
        db.pool.query(query2, function(error, rows, fields){
            res.render('components', {data: rows});                 
        })   
    });

app.get('/parts', function(req, res)
    {
        let query3 = "SELECT * FROM Parts;"; 
        
        db.pool.query(query3, function(error, rows, fields){
            res.render('parts', {data: rows});                 
        })   
    });

    app.get('/manuals', function(req, res)
    {
        let query4 = "SELECT * FROM Manuals;"; 
        
        db.pool.query(query4, function(error, rows, fields){
            res.render('manuals', {data: rows});                 
        })   
    });

    app.get('/manufacturers', function(req, res)
    {
        let query5 = "SELECT * FROM Manufacturers;"; 
        
        db.pool.query(query5, function(error, rows, fields){
            res.render('manufacturers', {data: rows});                 
        })   
    });

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});