// Adapted from class demo project: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    Add
*/
// Get the objects we need to modify
let addPatronsForm = document.getElementById('add-patrons-form-ajax')

// Modify the objects we need
addPatronsForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault()

    // Get form fields we need to get data from
    let inputName = document.getElementById("input-name")
    let inputPhoneNum = document.getElementById("input-phoneNum")
    let inputAddress = document.getElementById("input-address")

    // Get the values from the form fields
    let nameValue = inputName.value
    let phoneNumValue = inputPhoneNum.value
    let addressValue = inputAddress.value

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        phoneNum: phoneNumValue,
        address: addressValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("POST", "/add-patrons-ajax", true)
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