// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

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
// displaying pages
app.get(['/', '/index'], function(req, res)
    {  
        res.render('index');
    });

app.get('/equipment', function(req, res)
    {
        let query1 = "SELECT * FROM Equipment;";

        // If there is no query string, we just perform a basic SELECT
        if (req.query.name === undefined)
        {
            query1 = "SELECT * FROM Equipment;";
        }

        // If there is a query string, we assume this is a search, and return desired results
        else
        {
            query1 = `SELECT * FROM Equipment WHERE equipmentName LIKE "${req.query.name}%"`
        }

        // Query 2 is the same in both cases
        let query2 = "SELECT * FROM Equipment;";
        
        // Run the 1st query
        db.pool.query(query1, function(error, rows, fields){
        
            // Save all equipment
            let all_equipment = rows;
            
            // Run the second query
            db.pool.query(query2, (error, rows, fields) => {
            
                // Save equipment subset
                let subset_equipment = rows;

                return res.render('equipment', {data: all_equipment, search_data: subset_equipment});
            })
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

// adding new data
app.post('/add-equipment-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Equipment (equipmentName, equipmentNotes) VALUES ('${data.name}', '${data.notes}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on bsg_people
            query2 = `SELECT * FROM Equipment;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-manual-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Manuals (manualName, manualLink) VALUES ('${data.name}', '${data.link}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Manuals
            query2 = `SELECT * FROM Manuals;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/add-component-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let partID = parseInt(data.partID);
    if (isNaN(partID))
    {
        partID = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Components (componentName, componentDescription, partID, componentNotes) VALUES ('${data.name}', '${data.description}', ${partID}, '${data.notes}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Components
            query2 = `SELECT * FROM Components;`;
            db.pool.query(query2, function(error, rows, fields){

                // If there was an error on the second query, send a 400
                if (error) {
                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// deleting data
app.delete('/delete-equipment-ajax/', function(req,res,next){
    let data = req.body;
    let equipmentID = parseInt(data.id);
    // let deleteBsg_Cert_People = `DELETE FROM bsg_cert_people WHERE pid = ?`; // deleting value from intersection table
    let delete_equipment = `DELETE FROM Equipment WHERE equipmentID = ?`;
  
  
        //   // Run the 1st query
        //   db.pool.query(deleteBsg_Cert_People, [personID], function(error, rows, fields){
        //       if (error) {
  
        //       // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        //       console.log(error);
        //       res.sendStatus(400);
        //       }
  
        //       else
        //       {
        //           // Run the second query
        //           db.pool.query(deleteBsg_People, [personID], function(error, rows, fields) {
  
        //               if (error) {
        //                   console.log(error);
        //                   res.sendStatus(400);
        //               } else {
        //                   res.sendStatus(204);
        //               }
        //           })
        //       }

        // Run the query
        db.pool.query(delete_equipment, [equipmentID], function(error, rows, fields) {
  
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                res.sendStatus(204);
            }
  })});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});