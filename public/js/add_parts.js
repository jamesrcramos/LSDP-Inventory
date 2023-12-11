/* Citation for the "add_parts.js" file:
     Adapted from: Oregon State University's CS340's NodeJS Starter App Tutorial
     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
     Date: 12/10/2023 */


// Get the objects we need to modify
let addPartsForm = document.getElementById('add-parts-form-ajax');

// Modify the objects we need
addPartsForm.addEventListener("submit", function (e) {

    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-part-name");
    let inputManufacturer = document.getElementById("input-part-manufacturer-ajax");
    let selectedManufacturer = inputManufacturer.options[inputManufacturer.selectedIndex];
    let inputManual = document.getElementById("input-part-manual-ajax");
    let selectedManual = inputManual.options[inputManual.selectedIndex];
    let inputNotes = document.getElementById("input-part-notes");
    let inputStoreroom = document.getElementById("input-storeroom-number");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let manufacturerValue = selectedManufacturer.value;
    let manualValue = selectedManual.value;
    let notesValue = inputNotes.value;
    let storeroomValue = inputStoreroom.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        manufacturer: manufacturerValue,
        manual: manualValue,
        notes: notesValue,
        storeroomNumber: storeroomValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-part-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToPartsTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputManufacturer.value = '';
            inputManual.value = '';
            inputNotes.value = '';
            inputStoreroom.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Function to add a row to the parts table
addRowToPartsTable = (data) => {
    // Get a reference to the current table on the page
    let currentTable = document.getElementById("parts-table");

    // Parse the response data
    let parsedData = JSON.parse(data);
    let newRowData = parsedData[parsedData.length - 1];

    // Create the row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let manufacturerCell = document.createElement("TD");
    let manualCell = document.createElement("TD");
    let notesCell = document.createElement("TD");
    let storeroomCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with data
    idCell.innerText = newRowData.partID;
    nameCell.innerText = newRowData.partName;
    manufacturerCell.innerText = newRowData.partManufacturer; // You might want to adjust this to show manufacturer name instead of ID
    manualCell.innerText = newRowData.partManual; // Similar adjustment for manual
    notesCell.innerText = newRowData.partNotes;
    storeroomCell.innerText = newRowData.storeroomNumber;

    // Create and set up the delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteParts(newRowData.partID);
    };
    deleteCell.appendChild(deleteButton);

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(manufacturerCell);
    row.appendChild(manualCell);
    row.appendChild(storeroomCell);
    row.appendChild(notesCell);
    row.appendChild(deleteCell);

    // Add a row attribute for deletion
    row.setAttribute('data-value', newRowData.partID);

    // Add the row to the table
    currentTable.appendChild(row);
}