let updateEquipmentComponentsForm = document.getElementById('update-equipment-components-form-ajax');

updateEquipmentComponentsForm.addEventListener("submit", function (e) {
    // Prevent the form from submitting
    e.preventDefault();
    console.log("UPDATING 1")

    // Get form fields we need to get data from
    let inputEquipmentComponent = document.getElementById("select-equipment-components");
    let inputEquipment = document.getElementById("select-equipments");
    let inputComponent = document.getElementById("select-components");

    // Get the values from the form fields
    let equipmentComponentValue = inputEquipmentComponent.value;
    let equipmentValue = inputEquipment.value;
    let componentValue = inputComponent.value;
    //console.log("equipmentComponentValue: " + equipmentComponentValue)

    // Put our data we want to send in a javascript object
    let data = {
        equipmentComponent: equipmentComponentValue,
        equipment: equipmentValue,
        component: componentValue
    };
    console.log(data)

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-equipment-components-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            updateRow(xhttp.response, equipmentComponentValue); // Ensure this function is defined and works as expected
        } else if (xhttp.readyState == 4) {
            console.log("There was an error with the input: ", xhttp.statusText);
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

function updateRow(data, equipmentComponent) {
    let parsedData = JSON.parse(data);
    console.log("data: ", data)
    console.log("parsedData: ", parsedData)
    console.log("parsedData.updatedId: ", parsedData.updatedId)

    let table = document.getElementById("equipment-components-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        let id = row.cells[0].innerText;
        if (id == parsedData.updatedId) {
            console.log("data: " + data)
            console.log("id: " + id)
            row.cells[1].innerText = parsedData[0].equipment;
            console.log("parsedData[0].equipmentName: " + parsedData[0].equipment)
            row.cells[2].innerText = parsedData[0].component;
            break;
        }
    }
}