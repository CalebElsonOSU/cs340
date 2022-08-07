// Adapted from class demo project: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    Add
*/
// Get the objects we need to modify
let addOrdersWithItemsForm = document.getElementById('add-ordersWithItems-form-ajax');

// Modify the objects we need
addOrdersWithItemsForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputOrderID = document.getElementById("input-orderID");
    let inputItemID = document.getElementById("input-itemID");
    let inputItemQuantity = document.getElementById("input-itemQuantity");
    let inputItemTotalAmount = document.getElementById("input-itemTotalAmount");

    // Get the values from the form fields
    let orderIDValue = inputOrderID.value;
    let itemIDValue = inputItemID.value;
    let itemQuantityValue = inputItemQuantity.value;
    let itemTotalAmountValue = inputItemTotalAmount.value;

    // Put our data we want to send in a javascript object
    let data = {
        orderID: orderIDValue,
        itemID: itemIDValue,
        itemQuantity: itemQuantityValue,
        itemTotalAmount: itemTotalAmountValue
    }

    console.log(data)
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-ordersWithItems-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // // Add the new data to the table
            // addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputOrderID.value = '';
            inputItemID.value = '';
            inputItemQuantity.value = '';
            inputItemTotalAmount.value = '';

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
    Delete
*/
function deleteOrdersWithItems(orderID, itemID) {
    // Put our data we want to send in a javascript object
    let data = {
        orderID: orderID,
        itemID: itemID
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-ordersWithItems-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // TODO: Delete correct row
            // Fix for issues with ordering/rendering
            location.reload();

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log(xhttp.readyState, "status", xhttp.status)
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}




/*
    Update
*/
// Get the objects we need to modify
let updateOrderWithItemsForm = document.getElementById('update-orderWithItems-form-ajax');

// Modify the objects we need
updateOrderWithItemsForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let orderWithItem = document.getElementById("update-orderWithItem");
    let itemQuantity = document.getElementById("update-itemQuantity");
    let itemTotalAmount = document.getElementById("update-itemTotalAmount");

    let orderWithItemJSON = JSON.parse(orderWithItem.value);

    // Get the values from the form fields
    let orderIDValue = orderWithItemJSON.orderID;
    let itemIDValue = orderWithItemJSON.itemID;
    let itemQuantityValue = itemQuantity.value;
    let itemTotalAmountValue = itemTotalAmount.value;

    // Put our data we want to send in a javascript object
    let data = {
        orderID: orderIDValue,
        itemID: itemIDValue,
        itemQuantity: itemQuantityValue,
        itemTotalAmount: itemTotalAmountValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-orderWithItems-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // // Add the new data to the table
            // updateRow(xhttp.response, fullNameValue);

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