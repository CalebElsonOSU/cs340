// code for deletePerson function using jQuery
// function deletePerson(personID) {
//   let link = '/delete-person-ajax/';
//   let data = {
//     id: personID
//   };

//   $.ajax({
//     url: link,
//     type: 'DELETE',
//     data: JSON.stringify(data),
//     contentType: "application/json; charset=utf-8", 
//     success: function(result) {
//       deleteRow(personID);
//     }
//   });
// }

// code for deletePerson using regular javascript/xhttp
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


