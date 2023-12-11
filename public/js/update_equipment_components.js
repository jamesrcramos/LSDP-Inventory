/* Citation for the "update_equipment_components.js" file:
     Adapted from: Oregon State University's CS340's NodeJS Starter App Tutorial
     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
     Date: 12/10/2023 */


let updateEquipmentComponentsForm = document.getElementById('update-equipment-components-form-ajax');

updateEquipmentComponentsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    //console.log("UPDATING 1");

    let inputEquipmentComponent = document.getElementById("select-equipment-components");
    let inputEquipment = document.getElementById("select-equipments");
    let inputComponent = document.getElementById("select-components");

    let equipmentComponentID = inputEquipmentComponent.value;
    let equipmentID = inputEquipment.value;
    let componentID = inputComponent.value;

    let data = {
        equipmentComponentID: equipmentComponentID,
        equipment: equipmentID,
        component: componentID
    };
    //console.log(data);

    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-equipment-components-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            updateRow(xhttp.responseText, equipmentComponentID);
        } else if (xhttp.readyState == 4) {
            console.log("There was an error with the input: ", xhttp.statusText);
        }
    };

    xhttp.send(JSON.stringify(data));
});

function updateRow(response, equipmentComponentID) {
    let parsedData = JSON.parse(response);
    console.log(parsedData);

    let table = document.getElementById("equipment-components-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        let id = row.cells[0].innerText;
        if (id == equipmentComponentID) {
            // Assuming your response contains the updated equipment and component names
            row.cells[1].innerText = parsedData[0].equipmentName;
            row.cells[2].innerText = parsedData[0].componentName;
            break;
        }
    }
}
