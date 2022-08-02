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
    let inputRoleName = document.getElementById("input-roleName");
    let inputPay = document.getElementById("input-pay")

    // Get the values from the form fields
    let nameValue = inputName.value
    // Prevents error from trying to get value on a null
    let roleNameValue = inputRoleName != null ? inputRoleName.value : ''
    let payValue = inputPay.value

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        roleName: roleNameValue,
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
            // inputName.value = '';
            // inputRoleName.value = '';
            // inputPay.value = '';

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
    Add
*/
// Get the objects we need to modify
let filterEmployeesForm = document.getElementById('filter-employees-form-ajax');

// Modify the objects we need
filterEmployeesForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRoleName = document.getElementById("filter-roleName");
    // Prevents error from trying to get value on a null
    let roleNameValue = inputRoleName.value

    // Put our data we want to send in a javascript object
    let data = {
        roleName: roleNameValue
    }

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/filter-employees-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // // Add the new data to the table
            // addRowToTable(xhttp.response);
            console.log("xhttp", xhttp.respone, "x", xhttp)

            // // Clear the input fields for another transaction
            // inputName.value = '';
            // inputRoleName.value = '';
            // inputPay.value = '';

            // TODO: Insert row into correct place
            // Fix for issues with ordering/rendering
            //location.reload();
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})