function deleteEquipment(equipmentID) {
    let link = '/delete-equipment-ajax/';
    let data = {
      id: equipmentID
    };
  
    $.ajax({
        url: link,
        type: 'DELETE',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function(result) {
        deleteRow(equipmentID);
      }
    });
  }
  
  function deleteRow(equipmentID){
      let table = document.getElementById("equipment-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == equipmentID) {
              table.deleteRow(i);
              break;
         }
      }
  }