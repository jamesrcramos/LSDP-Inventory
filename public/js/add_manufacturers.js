let addManufacturerForm = document.getElementById('add-manufacturer-form-ajax');

addManufacturerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    let inputName = document.getElementById("input-manufacturer-name");
    let inputPhone = document.getElementById("input-manufacturer-phone");
    let inputEmail = document.getElementById("input-manufacturer-email");
    let inputNotes = document.getElementById("input-manufacturer-notes");

    let nameValue = inputName.value;
    let phoneValue = inputPhone.value;
    let emailValue = inputEmail.value;
    let notesValue = inputNotes.value;

    let data = {
        name: nameValue,
        phone: phoneValue,
        email: emailValue,
        notes: notesValue
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-manufacturer-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            addRowToManufacturerTable(xhttp.response);
            inputName.value = '';
            inputPhone.value = '';
            inputEmail.value = '';
            inputNotes.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    xhttp.send(JSON.stringify(data));
})

addRowToManufacturerTable = (data) => {
    let currentTable = document.getElementById("manufacturers-table");

    let parsedData = JSON.parse(data);
    let newRowData = parsedData[parsedData.length - 1];

    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let phoneCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let notesCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    idCell.innerText = newRowData.manufacturerID;
    nameCell.innerText = newRowData.manufacturerName;
    phoneCell.innerText = newRowData.manufacturerPhone;
    emailCell.innerText = newRowData.manufacturerEmail;
    notesCell.innerText = newRowData.manufacturerNotes;

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteManufacturer(newRowData.manufacturerID);
    };
    deleteCell.appendChild(deleteButton);

    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(phoneCell);
    row.appendChild(emailCell);
    row.appendChild(notesCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRowData.manufacturerID);

    currentTable.appendChild(row);
}
