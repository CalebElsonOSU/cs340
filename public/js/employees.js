// Adapted from class demo project: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    Add
*/
// Get the objects we need to modify
let addEmployeesForm = document.getElementById('add-employees-form-ajax');

// Modify the objects we need
addEmployeesForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputRoleID = document.getElementById("input-roleID");
    let inputPay = document.getElementById("input-pay")

    // Get the values from the form fields
    let nameValue = inputName.value
    let roleIDValue = inputRoleID.value
    let payValue = inputPay.value

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        roleID: roleIDValue,
        pay: payValue
    }

    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-employees-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // // Add the new data to the table
            // addRowToTable(xhttp.response);

            // // Clear the input fields for another transaction
            inputName.value = '';
            inputRoleID.value = '';
            inputPay.value = '';

            // TODO: Insert row into correct place
            // Fix for issues with ordering/rendering
            location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})




/*
    Update
*/
// Get the objects we need to modify
let updateEmployeesForm = document.getElementById('update-employees-form-ajax');

// Modify the objects we need
updateEmployeesForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let updateEmployeeID = document.getElementById("update-employeeID");
    let updateRoleID = document.getElementById("update-roleID");
    let updatePay = document.getElementById("update-pay")

    // Get the values from the form fields
    let employeeIDValue = updateEmployeeID.value
    let roleIDValue = updateRoleID.value
    let payValue = updatePay.value

    // Put our data we want to send in a javascript object
    let data = {
        employeeID: employeeIDValue,
        roleID: roleIDValue,
        pay: payValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-employees-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // TODO: Update correct row
            // Fix for issues with ordering/rendering
            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})