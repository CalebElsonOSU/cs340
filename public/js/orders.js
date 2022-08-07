// Adapted from class demo project: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    Add
*/
// Get the objects we need to modify
let addOrdersForm = document.getElementById('add-orders-form-ajax')

// Modify the objects we need
addOrdersForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault()

    // Get form fields we need to get data from
    let inputRestaurantID = document.getElementById("input-restaurantID")
    let inputPatronID = document.getElementById("input-patronID")
    let inputOrderDate = document.getElementById("input-orderDate")

    // Get the values from the form fields
    let restaurantIDValue = inputRestaurantID.value
    let patronIDValue = inputPatronID.value
    let orderDateValue = inputOrderDate.value

    // Put our data we want to send in a javascript object
    let data = {
        restaurantID: restaurantIDValue,
        patronID: patronIDValue,
        orderDate: orderDateValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("POST", "/add-orders-ajax", true)
    xhttp.setRequestHeader("Content-type", "application/json")

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // TODO: Insert row into correct place
            // Fix for issues with ordering/rendering
            location.reload()
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data))
})



/*
    Delete
*/
function deleteOrder(orderID) {
    // Put our data we want to send in a javascript object
    let data = {
        orderID: orderID
    };
    
    console.log(data, "data")
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("DELETE", "/delete-orders-ajax", true)
    xhttp.setRequestHeader("Content-type", "application/json")

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        console.log(xhttp.readyState, "status", xhttp.status)
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // TODO: Delete correct row
            // Fix for issues with ordering/rendering
            location.reload()
        } else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data))
}
