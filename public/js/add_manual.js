/* Citation for the "add_manual.js" file:
     Adapted from: Oregon State University's CS340's NodeJS Starter App Tutorial
     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
     Date: 12/10/2023 */


// Get the objects we need to modify
let addManualForm = document.getElementById('add-manual-form-ajax');

// Modify the objects we need
addManualForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputLink = document.getElementById("input-link");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let linkValue = inputLink.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        link: linkValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-manual-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputLink.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Manuals
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("manuals-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let linkCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.manualID;
    nameCell.innerText = newRow.manualName;
    linkCell.innerText = newRow.manualLink;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(linkCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}