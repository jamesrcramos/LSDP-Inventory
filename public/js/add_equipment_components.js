
let addEquipmentComponentForm = document.getElementById('add-equipment-component-form-ajax');

addEquipmentComponentForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let selectEquipment = document.getElementById("select-equipment");
    let selectComponent = document.getElementById("select-component");

    let equipmentID = selectEquipment.value;
    let componentID = selectComponent.value;

    let data = {
        equipmentID: equipmentID,
        componentID: componentID
    };

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-equipment-component-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState === 4 && xhttp.status === 200) {

            addRowToEquipmentComponentTable(xhttp.response);

            selectEquipment.value = '';
            selectComponent.value = '';
        }
        else if (xhttp.readyState === 4 && xhttp.status !== 200) {
            console.log("There was an error with the input.")
            console.log(xhttp.response)
        }
    };

    xhttp.send(JSON.stringify(data));
});

addRowToEquipmentComponentTable = (data) => {
    let currentTable = document.getElementById("equipment-components-table");
    //console.log(data) // Print the new row data
    let parsedData = JSON.parse(data);
    //console.log(parsedData) // Print the parsed new row data
    let newRowData = parsedData[parsedData.length - 1];
    //console.log("newRowData: " + newRowData);

    // Create the new row
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let equipmentCell = document.createElement("TD");
    let componentCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    //console.log("newRowData.equipmentComponentID: " + newRowData.equipmentName)
    //console.log("newRowData.equipmentID: " + newRowData.equipmentID)

    idCell.innerText = newRowData.equipmentComponentID;
    equipmentCell.innerText = newRowData.equipmentName;  // Show the name of the equipment, not the ID
    componentCell.innerText = newRowData.componentName;  // Show the name of the component, not the ID

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteEquipmentComponent(newRowData.equipmentComponentID);
    };
    deleteCell.appendChild(deleteButton);

    row.appendChild(idCell);
    row.appendChild(equipmentCell);
    row.appendChild(componentCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRowData.equipmentComponentID);
    //console.log("row.getAttribute('data-value'): " + row.getAttribute('data-value')
    //    + " newRowData.equipmentComponentID: " + newRowData.equipmentComponentID);
    currentTable.appendChild(row);
};
