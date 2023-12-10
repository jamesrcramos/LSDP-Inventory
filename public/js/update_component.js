
// Get the objects we need to modify
let updateComponentForm = document.getElementById('update-component-form-ajax');

// Modify the objects we need
updateComponentForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputComponent = document.getElementById("mySelect");
    let inputPart = document.getElementById("input-part-update");

    // Get the values from the form fields
    let componentValue = inputComponent.value;
    let partValue = inputPart.value;
    
    // if (isNaN(partValue)) 
    // {
    //     return;
    // }


    // Put our data we want to send in a javascript object
    let data = {
        component: componentValue,
        part: partValue,
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-component-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, componentValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, componentID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("components-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == componentID) {

            // Get the location of the row where we found the matching component ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}
