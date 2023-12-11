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
      console.log("equipmentID: ", equipmentID)
      console.log("table: ", table)

      for (let i = 0, row; row == table.rows[i]; i++) {
          console.log("table rows: ", table.rows[i].getAttribute("data-value"))
          console.log("equipmentID: ", equipmentID)
          console.log("table.rows[i].getAttribute('data-value') === equipmentID: ", table.rows[i].getAttribute("data-value") === equipmentID)
         if (table.rows[i].getAttribute("data-value") == equipmentID) {
              table.deleteRow(i);
              break;
         }
      }
  }