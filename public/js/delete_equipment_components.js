/* Citation for the "delete_equipment_components.js" file:
     Adapted from: Oregon State University's CS340's NodeJS Starter App Tutorial
     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
     Date: 12/10/2023 */


function deleteEquipmentComponent(equipmentComponentID) {
    let link = '/delete-equipment-component-ajax/';
    let data = {
        id: equipmentComponentID
    };

    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteEquipmentComponentRow(equipmentComponentID);
        }
    });
}

function deleteEquipmentComponentRow(equipmentComponentID) {
    let table = document.getElementById("equipment-components-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        //console.log("Checking row " + i + " for equipment component row: " + table.rows[i].getAttribute("data-value"))
        //console.log("equipmentComponentID: " + equipmentComponentID)
        //console.log("table.rows[i].getAttribute('data-value') == equipmentComponentID: " + table.rows[i].getAttribute("data-value") == equipmentComponentID);
        if (table.rows[i].getAttribute("data-value") == equipmentComponentID) {
            table.deleteRow(i);
            //console.log("Deleted equipment component row")
            break;
        }
        //console.log("Did not find equipment component row")
    }
}
