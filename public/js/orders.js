/*
    Add
*/
// Get the objects we need to modify
let addOrdersForm = document.getElementById('add-orders-form-ajax');

// Modify the objects we need
addOrdersForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputRestaurantID = document.getElementById("input-restaurantID");
    let inputPatronID = document.getElementById("input-patronID");
    let inputOrderDate = document.getElementById("input-orderDate")

    // Get the values from the form fields
    let restaurantIDValue = inputRestaurantID.value;
    let patronIDValue = inputPatronID.value;
    let orderDateValue = inputOrderDate.value;

    // Put our data we want to send in a javascript object
    let data = {
        restaurantID: restaurantIDValue,
        patronID: patronIDValue,
        orderDate: orderDateValue
    }

    console.log(data)
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-orders-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // // Add the new data to the table
            // addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputRestaurantID.value = '';
            inputPatronID.value = '';
            inputOrderDate.value = '';


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