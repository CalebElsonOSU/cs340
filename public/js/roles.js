// Adapted from class demo project: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    Add
*/
// Get the objects we need to modify
let addRolesForm = document.getElementById('add-roles-form-ajax')

// Modify the objects we need
addRolesForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault()

    // Get form fields we need to get data from
    let inputRoleName = document.getElementById("input-roleName")

    // Get the values from the form fields
    let roleNameValue = inputRoleName.value

    // Put our data we want to send in a javascript object
    let data = {
        roleName: roleNameValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest()
    xhttp.open("POST", "/add-roles-ajax", true)
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