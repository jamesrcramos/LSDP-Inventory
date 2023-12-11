/* Citation for the "reset_database.js" file:
     Original work done by James Ramos and Carlos Bernal Urbina
     Date: 12/10/2023 */

document.getElementById('reset-database').addEventListener('click', function() {
    if (confirm("Are you sure you want to reset the database? This cannot be undone.")) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                alert("Database reset successfully");
            } else if (this.readyState == 4) {
                alert("Error resetting database");
            }
        };
        xhttp.open("GET", "/reset-database", true);
        xhttp.send();
    }
});