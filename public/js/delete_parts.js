/* Citation for the "delete_parts.js" file:
     Adapted from: Oregon State University's CS340's NodeJS Starter App Tutorial
     Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
     Date: 12/10/2023 */


function deleteParts(partID){
    let link = '/delete-part-ajax/';
    let data = {
        id: partID
    };

    $.ajax({
        type: 'DELETE',
        url: link,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteRow(partID);
        }
    });
}

function deleteRow(partID){
    let table = document.getElementById("parts-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == partID) {
            table.deleteRow(i);
            break;
        }
    }
}