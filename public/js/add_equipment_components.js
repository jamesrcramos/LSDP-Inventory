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
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            addRowToEquipmentComponentTable(xhttp.response);
            selectEquipment.value = '';
            selectComponent.value = '';
        }
    };

    xhttp.send(JSON.stringify(data));
});

addRowToEquipmentComponentTable = (data) => {
    let currentTable = document.getElementById("equipment-components-table");

    let parsedData = JSON.parse(data);
    let newRowData = parsedData[parsedData.length - 1];

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let equipmentCell = document.createElement("TD");
    let componentCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    idCell.innerText = newRowData.equipmentComponentID;
    equipmentCell.innerText = newRowData.equipmentID;  // Ideally, show equipment name
    componentCell.innerText = newRowData.componentID;  // Ideally, show component name

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

    currentTable.appendChild(row);
};
