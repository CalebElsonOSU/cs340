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
    xhttp.open("POST", "/owls-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputOrderID.value = '';
            inputItemID.value = '';
            inputItemQuantity.value = '';
            inputItemTotalAmount.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("reed", xhttp.readyState, "status", xhttp.status)
            console.log(xhttp.response, "ord", inputOrderID.value, "itemid", inputItemID.value, "quant", inputItemQuantity.value, "totamount", inputItemTotalAmount.value, typeof(data.itemID), parseFloat(data.itemTotalAmount))
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// ordersWithItems
addRowToTable = (data) => {
    console.log("addrowtotable")
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("ordersWithItems-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let orderIDCell = document.createElement("TD");
    let itemIDCell = document.createElement("TD");
    let itemQuantityCell = document.createElement("TD");
    let itemTotalAmountCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    orderIDCell.innerText = newRow.orderID;
    itemIDCell.innerText = newRow.itemID;
    itemQuantityCell.innerText = newRow.itemQuantity;
    itemTotalAmountCell.innerText = newRow.itemTotalAmount;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePerson(newRow.id);
    };



    // Add the cells to the row 
    row.appendChild(orderIDCell);
    row.appendChild(itemIDCell);
    row.appendChild(itemQuantityCell);
    row.appendChild(itemTotalAmountCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.id);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("mySelect");
    let option = document.createElement("option");
    option.text = newRow.fname + ' ' +  newRow.lname;
    option.value = newRow.id;
    selectMenu.add(option);
    // End of new step 8 code.
}




/*
    Delete
*/
function deletePerson(orderID, itemID) {
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

            // Add the new data to the table
            //deleteRow(personID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

    location.reload();
}




/*
    Update
*/
// Get the objects we need to modify
let updatePersonForm = document.getElementById('update-person-form-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("mySelect");
    let inputHomeworld = document.getElementById("input-homeworld-update");

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let homeworldValue = inputHomeworld.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    if (isNaN(homeworldValue)) 
    {
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        fullname: fullNameValue,
        homeworld: homeworldValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-person-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, fullNameValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, personID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("ordersWithItems-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == personID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}