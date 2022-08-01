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

    location.reload()
})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {
    console.log("addrowtotable")
    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("people-table");

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