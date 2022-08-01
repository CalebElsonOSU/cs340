/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8747;                 // Set a port number at the top so it's easy to change in the future

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

// Handlebars helpers
var helpers = require('handlebars-helpers')();

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));         // this is needed to allow for the form to use the ccs style sheet/javscript

app.get('/ordersWithItems', function(req, res)
{
    // Declare queries
    let query1 = "SELECT * FROM OrdersWithItems;";
    let query2 = "SELECT * FROM Orders;"
    let query3 = "SELECT * FROM Items"


    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        
        // Save the items
        let ordersWithItems = rows;

        db.pool.query(query2, function(error, rows, fields) {
            let orders = rows;

            db.pool.query(query3, function(error, rows, fields) {
                let items = rows;

                let itemMap = {}
                items.map(item => {
                    let id = parseInt(item.itemID, 10);
    
                    itemMap[id] = item["name"];
                })
    
                // Overwrite the homeworld ID with the name of the planet in the people object
                ordersWithItems = ordersWithItems.map(owi => {
                    return Object.assign(owi, {itemName: itemMap[owi.itemID]})
                })

                return res.render('ordersWithItems', {ordersWithItems: ordersWithItems, orders: orders, items: items});
            })
        })
    })
});

app.post('/owls-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let orderID = parseInt(data.orderID)
    let itemID = parseInt(data.itemID)
    let itemQuantity = parseInt(data.itemQuantity)
    let itemTotalAmount = parseFloat(data.itemTotalAmount)

    // Create the query and run it on the database
    query1 = `INSERT INTO OrdersWithItems (orderID, itemID, itemQuantity, itemTotalAmount) VALUES (${orderID}, ${itemID}, ${itemQuantity}, ${itemTotalAmount})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(401);
        }
        else
        {
            query2 = `SELECT * FROM OrdersWithItems`;

            db.pool.query(query2, function(error, rows, fields) {
                if (error) {
                    console.log(error)
                    console.log("fsdafsdasdfa")
                    res.sendStatus(400)
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.get('/employees', function (req, res) {
    res.sendfile(__dirname + '/views/employees.html');
});

app.get('/', function (req, res) {
    res.render('index')
});

app.get('/patrons', function (req, res) {
    res.sendfile(__dirname + '/views/patrons.html');
});

app.get('/restaurants', function (req, res) {
    res.sendfile(__dirname + '/views/restaurants.html');
});

app.get('/items', function (req, res) {
    res.sendfile(__dirname + '/views/items.html');
});

app.get('/roles', function (req, res) {
    res.sendfile(__dirname + '/views/roles.html');
});

app.get('/orders', function (req, res) {
    res.sendfile(__dirname + '/views/orders.html');
});

app.get('/ordersWithItems', function (req, res) {
    res.sendfile(__dirname + '/views/ordersWithItems.html');
});

app.get('/restaurantsWithEmployees', function (req, res) {
    res.sendfile(__dirname + '/views/restaurantsWithEmployees.html');
});

app.get('/ordersWithRestaurants', function (req, res) {
    res.sendfile(__dirname + '/views/ordersWithRestaurants.html');
});



app.delete('/delete-ordersWithItems-ajax/', function(req,res,next){
  let data = req.body;
  let itemID = parseInt(data.itemID);
  let orderID = parseInt(data.orderID);
  let deleteOrdersWithItems = `DELETE FROM OrdersWithItems WHERE itemID = ? AND orderID = ?`;

    // Run the 1st query
    db.pool.query(deleteOrdersWithItems, [itemID, orderID], function(error, rows, fields){
    if (error) {

    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
    console.log(error);
    res.sendStatus(400);
    }

    else
    {
        res.sendStatus(204);
    }
})});

app.put('/put-person-ajax', function(req,res,next){                                   
  let data = req.body;

  let homeworld = parseInt(data.homeworld);
  let person = parseInt(data.fullname);

  queryUpdateWorld = `UPDATE bsg_people SET homeworld = ? WHERE bsg_people.id = ?`;
  selectWorld = `SELECT * FROM bsg_planets WHERE id = ?`

        // Run the 1st query
        db.pool.query(queryUpdateWorld, [homeworld, person], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectWorld, [homeworld], function(error, rows, fields) {
        
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});



/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});