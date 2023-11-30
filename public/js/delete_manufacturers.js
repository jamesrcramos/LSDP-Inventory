function deleteManufacturer(manufacturerID) {
    let link = '/delete-manufacturer-ajax/';
    let data = {
        id: manufacturerID
    };

    $.ajax({
        type: 'DELETE',
        url: link,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
            deleteManufacturerRow(manufacturerID);
        }
    });
}

function deleteManufacturerRow(manufacturerID){
    let table = document.getElementById("manufacturers-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
        if (table.rows[i].getAttribute("data-value") == manufacturerID) {
            table.deleteRow(i);
            break;
        }
    }
}
