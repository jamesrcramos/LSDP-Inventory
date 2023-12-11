// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

PORT        = 3000          // Set a port number at the top, so it's easy to change in the future

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

// API endpoint for fetching equipment
app.get('/api/equipment', function(req, res) {
    let query = "SELECT equipmentID AS id, equipmentName AS name FROM Equipment;";
    db.pool.query(query, function(error, results) {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(results);
        }
    });
});

// API endpoint for fetching components
app.get('/api/components', function(req, res) {
    let query = "SELECT componentID AS id, componentName AS name FROM Components;";
    db.pool.query(query, function(error, results) {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(results);
        }
    });
});

// API endpoint for fetching equipment components
app.get('/api/equipment-components', function(req, res) {
    let query = `
        SELECT Equipment_Components.equipmentComponentID, Equipment.equipmentName, Components.componentName 
        FROM Equipment_Components 
        JOIN Equipment ON Equipment_Components.equipmentID = Equipment.equipmentID 
        JOIN Components ON Equipment_Components.componentID = Components.componentID
        ORDER BY Equipment_Components.equipmentComponentID;`;

    db.pool.query(query, function(error, results) {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(results);
        }
    });
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
        db.pool.query(query1, function(error, rows){
        
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
    let query1 = `
        SELECT Components.componentID, Components.componentName,
                Components.componentDescription, Parts.partName, Components.componentNotes
        FROM Components
        LEFT JOIN Parts ON Components.partID = Parts.partID
        ORDER BY Components.componentID`;

    let query2 = "SELECT * FROM Parts;"; 
    
    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.error("Error in query1: ", error);
            return res.status(500).send("Database query error");
        }
        let components = rows;
    
        db.pool.query(query2, (error, rows, fields) => {
            if (error) {
                console.error("Error in query2: ", error);
                return res.status(500).send("Database query error");
            }
            let parts = rows;
            res.render('components', { data: components, parts: parts });
        });
    });
});
    
app.get('/equipment-components', function(req, res) {
    let query = `
        SELECT Equipment_Components.equipmentComponentID, Equipment.equipmentName, Components.componentName 
        FROM Equipment_Components 
        JOIN Equipment ON Equipment_Components.equipmentID = Equipment.equipmentID 
        JOIN Components ON Equipment_Components.componentID = Components.componentID
        ORDER BY Equipment_Components.equipmentComponentID;`;

    db.pool.query(query, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(500);
        } else {
            res.render('equipment_components', {data: rows});
        }
    });
});

app.get('/parts', function(req, res)
    {
        let query1 = `
            SELECT Parts.partID, Parts.partName, Manufacturers.manufacturerName,
            Manuals.manualName, Parts.partNotes, Parts.storeroomNumber
            FROM Parts
            LEFT JOIN Manufacturers ON Manufacturers.manufacturerID = Parts.partManufacturer
            LEFT JOIN Manuals ON Manuals.manualID = Parts.partManual
            ORDER BY Parts.partID`;

        let query2 = "SELECT * FROM Manufacturers";

        let query3 = "SELECT * FROM Manuals";
        
        db.pool.query(query1, function(error, rows, fields){
            let parts = rows;
            
            db.pool.query(query2, (error, rows, fields) => {
                let manufacturers = rows;

                db.pool.query(query3, (error, rows, fields) => {
                    let manuals = rows;
                    res.render('parts', {data: parts, manufacturers: manufacturers, manuals: manuals}); 
                })     
            })                    
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

// Adding new data for parts
app.post('/add-part-ajax', function(req, res) {
    let data = req.body;
    console.log(data)
    let query = `INSERT INTO Parts (partName, partManufacturer, partManual, partNotes, storeroomNumber) VALUES ('${data.name}', ${data.manufacturer}, ${data.manual || 'NULL'}, '${data.notes}', ${data.storeroomNumber})`;
    console.log(query)
    db.pool.query(query, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            let query2 = "SELECT * FROM Parts;";
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
});

app.post('/add-manufacturer-ajax', function(req, res) {
    let data = req.body;
    let query = `INSERT INTO Manufacturers (manufacturerName, manufacturerPhone, manufacturerEmail, manufacturerNotes) VALUES ('${data.name}', '${data.phone}', '${data.email}', '${data.notes}')`;
    db.pool.query(query, function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            let query2 = "SELECT * FROM Manufacturers;";
            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            });
        }
    });
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
    query1 = `INSERT INTO Components (componentName, componentDescription, partID, componentNotes) 
    VALUES ('${data.name}', '${data.description}', ${partID}, '${data.notes}')`;
    db.pool.query(query1, function(error, rows, fields){

        if (error) {

            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // Return all components
            query2 = `SELECT * FROM Components;`;
            db.pool.query(query2, function(error, rows, fields){

                // SEnd a 400 if there was an error on the second query
                if (error) {

                    console.log(error);
                    res.sendStatus(400);
                }
                // Return the results of the query
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

// adding new data for equipment components
app.post('/add-equipment-component-ajax', function(req, res) {
    let data = req.body;
    let query = `INSERT INTO Equipment_Components (equipmentID, componentID) 
    VALUES (${data.equipmentID}, ${data.componentID})`;

    db.pool.query(query, function(error, rows, fields){
        if (error) {
            console.log('error: ' + error);
            res.sendStatus(400);
        } else {

            let query2 = `
                SELECT Equipment_Components.equipmentComponentID, Equipment.equipmentName, Components.componentName 
                FROM Equipment_Components 
                JOIN Equipment ON Equipment_Components.equipmentID = Equipment.equipmentID 
                JOIN Components ON Equipment_Components.componentID = Components.componentID
                ORDER BY Equipment_Components.equipmentComponentID;`;

            db.pool.query(query2, function(error, rows, fields){
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    //console.log("rows: " + rows);
                    res.json(rows); // Send back the updated list of equipment-component relationships
                }
            });
        }
    });
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

app.delete('/delete-manufacturer-ajax/', function(req,res){
    let data = req.body;
    let manufacturerID = parseInt(data.id);
    let deleteQuery = `DELETE FROM Manufacturers WHERE manufacturerID = ?`;
    db.pool.query(deleteQuery, [manufacturerID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

app.delete('/delete-part-ajax/', function(req,res){
    let data = req.body;
    let partID = parseInt(data.id);
    let deleteQuery = `DELETE FROM Parts WHERE partID = ?`;

    db.pool.query(deleteQuery, [partID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});


// deleting data for equipment components
app.delete('/delete-equipment-component-ajax/', function(req,res){
    let data = req.body;
    let equipmentComponentID = parseInt(data.id);
    let deleteQuery = `DELETE FROM Equipment_Components WHERE equipmentComponentID = ?`;

    db.pool.query(deleteQuery, [equipmentComponentID], function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.sendStatus(204);
        }
    });
});

// Reset database
app.get('/reset-database', async function(req, res) {
    const commands = [
        "SET FOREIGN_KEY_CHECKS=0;",

        // Dropping all tables

        "DROP TABLE IF EXISTS Equipment_Components;",
        "DROP TABLE IF EXISTS Components;",
        "DROP TABLE IF EXISTS Parts;",
        "DROP TABLE IF EXISTS Equipment;",
        "DROP TABLE IF EXISTS Manufacturers;",
        "DROP TABLE IF EXISTS Manuals;",

        // Recreating all tables
        "CREATE TABLE Manuals (manualID int NOT NULL UNIQUE AUTO_INCREMENT, manualName varchar(50) NOT NULL UNIQUE, manualLink varchar(255), PRIMARY KEY (manualID));",
        "CREATE TABLE Manufacturers (manufacturerID int NOT NULL UNIQUE AUTO_INCREMENT, manufacturerName varchar(50) NOT NULL UNIQUE, manufacturerPhone varchar(50), manufacturerEmail varchar(50), manufacturerNotes varchar(255), PRIMARY KEY (manufacturerID));",
        "CREATE TABLE Equipment (equipmentID int NOT NULL UNIQUE AUTO_INCREMENT, equipmentName varchar(50) NOT NULL UNIQUE, equipmentNotes varchar(255), PRIMARY KEY (equipmentID));",
        "CREATE TABLE Parts (partID int NOT NULL UNIQUE AUTO_INCREMENT, partName varchar(50) NOT NULL UNIQUE, partManufacturer int NOT NULL, partManual int, partNotes varchar(50), storeroomNumber int, PRIMARY KEY (partID), FOREIGN KEY (partManufacturer) REFERENCES Manufacturers(manufacturerID) ON DELETE CASCADE, FOREIGN KEY (partManual) REFERENCES Manuals(manualID) ON DELETE CASCADE);",
        "CREATE TABLE Components (componentID int NOT NULL UNIQUE AUTO_INCREMENT, componentName varchar(50) NOT NULL UNIQUE, componentDescription varchar(50), partID int, componentNotes varchar(255), PRIMARY KEY (componentID), FOREIGN KEY (partID) REFERENCES Parts(partID) ON DELETE CASCADE);",
        "CREATE TABLE Equipment_Components (equipmentComponentID int NOT NULL UNIQUE AUTO_INCREMENT, equipmentID int NOT NULL, componentID int NOT NULL, PRIMARY KEY (equipmentComponentID), UNIQUE KEY unique_equipment_component (equipmentID, componentID), FOREIGN KEY (equipmentID) REFERENCES Equipment(equipmentID) ON DELETE CASCADE, FOREIGN KEY (componentID) REFERENCES Components(componentID) ON DELETE CASCADE);",

        // Inserting initial data
        "INSERT INTO Manuals (manualName, manualLink) VALUES ('Alfa Laval Manual', 'https://s3.amazonaws.com/freecodecamp/relaxing-cat.jpg'), ('Burkert Manual', 'https://bit.ly/fcc-running-cats'), ('Sigma Manual', 'https://bit.ly/2RhOvm4'), ('Emerson Manual', 'https://www.youtube.com/watch?v=J---aiyznGQ');",
        "INSERT INTO Manufacturers (manufacturerName, manufacturerPhone, manufacturerEmail, manufacturerNotes) VALUES ('Alfa Laval', '<Manufacturer Phone 1>', '<Manufacturer Email 1>', 'Notes for Alfa Laval'), ('Burkert', '<Manufacturer Phone 2>', '<Manufacturer Email 2>', 'Notes for Burkert'), ('Sigma', NULL, NULL, 'Notes for Sigma'), ('Emerson', NULL, NULL, 'Notes for Emerson');",
        "INSERT INTO Equipment (equipmentName, equipmentNotes) VALUES ('Fin1', 'Finisher 1'), ('HPP2', 'High Pressure Pump 2'), ('SEP1', 'Separator 1'), ('CIPB', 'CIP B'), ('RT01', 'Raw Silo 1'), ('D1', 'Dryer 1');",
        "INSERT INTO Parts (partName, partManufacturer, partManual, partNotes, storeroomNumber) VALUES ('LKH45', 1, 1, '45 HP Centripetal Pump', 43), ('B15', 2, 2, '4-20 ma Control Valve', 22), ('PT100', 3, NULL, 'Sanitary RTD', 11), ('P5432', 4, NULL, '120 inH20 Sanitary Pressure Sensor', 17);",
        "INSERT INTO Components (componentName, componentDescription, partID, componentNotes) VALUES ('PUM4569', 'Raw Silo 1 Discharge Pump', 1, 'Located in RT Hall'), ('PUM4570', 'CIP B Supply Pump', 1, 'Located in RAW CIP Room'), ('TCV8570', 'Finisher 1 Temperature Control Valve', 2, 'Level 115 between finishers 1 and 2'), ('TE3535', 'Dryer 1 Burner Temp', 3, 'Dryer 1 Burner Temp'), ('PT1323', 'Separator 1 Back Pressure', 4, 'Separator 1 Back Pressure');",
        "INSERT INTO Equipment_Components (equipmentID, componentID) VALUES (3, 5), (4, 2), (5, 1), (6, 4);",
        "SET FOREIGN_KEY_CHECKS=1;"
    ];

    try {
        for (const command of commands) {
            await new Promise((resolve, reject) => {
                db.pool.query(command, (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                });
            });
        }
        res.send("Database reset successfully");
    } catch (error) {
        console.error("Database reset error: ", error);
        res.status(500).send("Error resetting database");
    }
});


// updating data
app.put('/put-component-ajax', function(req,res,next){
    let data = req.body;
  
    let part = data.part === "" ? null : parseInt(data.part);
    let component = parseInt(data.component);
  
    let queryUpdatePart = `UPDATE Components SET partID = ? WHERE Components.componentId = ?`;
    let selectPart = `SELECT * FROM Parts WHERE partId = ?`
  
          // Run the 1st query
          db.pool.query(queryUpdatePart, [part, component], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectPart, [part], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

// updating Equipment Components

app.put('/put-equipment-components-ajax', function(req, res) {
    let data = req.body;
    let equipmentComponentID = parseInt(data.equipmentComponentID);
    let newEquipmentID = parseInt(data.equipment);
    let newComponentID = parseInt(data.component);

    if (isNaN(equipmentComponentID) || isNaN(newEquipmentID) || isNaN(newComponentID)) {
        return res.status(400).send('Invalid IDs');
    }

    let queryUpdateEquipmentComponent = `UPDATE Equipment_Components SET equipmentID = ?, componentID = ? WHERE equipmentComponentID = ?`;

    db.pool.query(queryUpdateEquipmentComponent, [newEquipmentID, newComponentID, equipmentComponentID], function(error, result) {
        if (error) {
            console.log(error);
            return res.sendStatus(400);
        } else {
            // Return the updated equipment-component entry
            let querySelectUpdated = `
                SELECT Equipment_Components.equipmentComponentID, Equipment.equipmentName, Components.componentName 
                FROM Equipment_Components
                JOIN Equipment ON Equipment_Components.equipmentID = Equipment.equipmentID
                JOIN Components ON Equipment_Components.componentID = Components.componentID
                WHERE Equipment_Components.equipmentComponentID = ?`;
            db.pool.query(querySelectUpdated, [equipmentComponentID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows); // Send back the updated equipment-component entry
                }
            });
        }
    });
});


/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});