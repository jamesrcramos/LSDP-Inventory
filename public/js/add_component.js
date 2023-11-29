// Get the objects we need to modify
let addComponentForm = document.getElementById('add-component-form-ajax');

// Modify the objects we need
addComponentForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputDescription = document.getElementById("input-description");
    let inputPartID = document.getElementById("input-partID");
    let inputNotes = document.getElementById("input-notes");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let descriptionValue = inputDescription.value;
    let partIDValue = inputPartID.value;
    let notesValue = inputNotes.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        description: descriptionValue,
        partID: partIDValue,
        notes: notesValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-component-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputDescription.value = '';
            inputPartID.value = '';
            inputNotes.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// Components
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("components-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let descriptionCell = document.createElement("TD");
    let partIDCell = document.createElement("TD");
    let notesCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.componentID;
    nameCell.innerText = newRow.componentName;
    descriptionCell.innerText = newRow.componentDescription;
    partIDCell.innerText = newRow.partID;
    notesCell.innerText = newRow.componentNotes;

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(descriptionCell);
    row.appendChild(partIDCell);
    row.appendChild(notesCell);
    
    // Add the row to the table
    currentTable.appendChild(row);
}