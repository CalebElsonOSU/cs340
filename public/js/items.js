// Adapted from class demo project: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    Add
*/
// Get the objects we need to modify
let addItemsForm = document.getElementById('add-items-form-ajax');

// Modify the objects we need
addItemsForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name");
    let inputItemPrice = document.getElementById("input-itemPrice");

    // Get the values from the form fields
    let inputNameValue = inputName.value;
    let inputItemPriceValue = inputItemPrice.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: inputNameValue,
        itemPrice: inputItemPriceValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-items-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
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