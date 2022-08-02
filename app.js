/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8746;                 // Set a port number at the top so it's easy to change in the future

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



app.get('/', function (req, res) {
    res.render('index')
});


/*
    ordersWithItems
*/
app.get('/ordersWithItems', function(req, res)
{
    // Declare queries
    let query1 = "SELECT * FROM OrdersWithItems;";
    let query2 = "SELECT * FROM Orders;"
    let query3 = "SELECT * FROM Items;"


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

app.post('/add-ordersWithItems-ajax', function(req, res) {
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
    })
});
  
  app.put('/put-orderWithItems-ajax', function(req,res,next){                                   
    let data = req.body;
  
    let orderID = parseInt(data.orderID)
    let itemID = parseInt(data.itemID)
    let itemQuantity = parseInt(data.itemQuantity)
    let itemTotalAmount = parseFloat(data.itemTotalAmount)
  
    queryUpdateItemQuantity = `UPDATE OrdersWithItems SET itemQuantity = ? WHERE (OrdersWithItems.orderID = ? AND OrdersWithItems.itemID = ?);`;
    queryUpdateItemTotalAmount = `UPDATE OrdersWithItems SET itemTotalAmount = ? WHERE (OrdersWithItems.orderID = ? AND OrdersWithItems.itemID = ?);`;
    selectWorld = `SELECT * FROM bsg_planets WHERE id = ?;`
  
          // Run the 1st query
          db.pool.query(queryUpdateItemQuantity, [itemQuantity, orderID, itemID], function(error, rows, fields){
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
                  db.pool.query(queryUpdateItemTotalAmount, [itemTotalAmount, orderID, itemID], function(error, rows, fields) {
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
    employees
*/
app.get('/employees', function (req, res) {
    // Declare queries
    let query1 = `SELECT employeeID, name, Roles.roleName, pay
        FROM Employees 
        LEFT JOIN Roles ON Employees.roleID = Roles.roleID;`

    // Run query
    db.pool.query(query1, function(error, rows, fields){
        let employees = rows

        let query2 = "SELECT * FROM Roles"

        db.pool.query(query2, function(error, rows, fields) {
            return res.render('employees', {employees: employees, roles: rows});
        })        
    })
});

app.post('/add-employees-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Capture NULL values
    let roleID = parseInt(data['roleID']);
    if (isNaN(roleID)) {
        roleID = 'NULL'
    }

    let pay = parseFloat(data['pay'])
    if (isNaN(pay)) {
        pay = 'NULL'
    }

    // Create the query and run it on the database
    query1 = `INSERT INTO Employees (name, roleID, pay) VALUES ('${data['name']}', ${roleID}, ${pay});`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Employees`;

            db.pool.query(query2, function(error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.post('/filter-employees-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `SELECT employeeID, name, roleID Roles.roleName, pay
    FROM Employees
    INNER JOIN Roles ON Employees.roleID = Roles.roleID AND Roles.roleName = ?
    GROUP BY Roles.roleName DESC;`;
    // Run query
    db.pool.query(query1, [data['roleName']], function(error, rows, fields){
        let employees = rows

        let query2 = "SELECT * FROM Roles"

        db.pool.query(query2, function(error, rows, fields) {
            console.log("employees", employees)
            res.send(employees)
            //return res.render('employees', {employees: employees, roles: rows});
        })        
    })
});





/*
    patrons
*/
app.get('/patrons', function (req, res) {
    // Declare queries
    let query = "SELECT * FROM Patrons"

    // Run the 1st query
    db.pool.query(query, function(error, rows, fields){
        return res.render('patrons', {patrons: rows});
    })
});

app.post('/add-patrons-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Patrons (name, phoneNum, address) VALUES ('${data['name']}', '${data['phoneNum']}', '${data['address']}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Patrons`;

            db.pool.query(query2, function(error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                } else {
                    res.send(rows);
                }
            })
        }
    })
});




/*
    restaurants
*/
app.get('/restaurants', function (req, res) {
    // Declare queries
    let query = "SELECT * FROM Restaurants"

    // Run the 1st query
    db.pool.query(query, function(error, rows, fields){
        return res.render('restaurants', {restaurants: rows});
    })
});

app.post('/add-restaurants-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Restaurants (location, phoneNum, hours) VALUES ('${data['location']}', '${data['phoneNum']}', '${data['hours']}');`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Restaurants`;

            db.pool.query(query2, function(error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                } else {
                    res.send(rows);
                }
            })
        }
    })
});




/*
    ordersWithItems
*/
app.get('/items', function (req, res) {
    // Declare queries
    let query = "SELECT * FROM Items"

    // Run the 1st query
    db.pool.query(query, function(error, rows, fields){
        let items = rows

        return res.render('items', {items: rows});
    })
});

app.post('/add-items-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let itemPrice = parseFloat(data.itemPrice)

    // Create the query and run it on the database
    query1 = `INSERT INTO Items (name, itemPrice) VALUES ('${data['name']}', ${itemPrice})`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(401);
        }
        else
        {
            query2 = `SELECT * FROM Items`;

            db.pool.query(query2, function(error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                } else {
                    res.send(rows);
                }
            })
        }
    })
});

app.get('/roles', function (req, res) {
    res.sendfile(__dirname + '/views/roles.html');
});




/*
    orders
*/
app.get('/orders', function (req, res) {
    // Declare queries
    // Adapted from https://stackoverflow.com/questions/64525959/sql-query-to-sum-values-from-column-using-the-same-id-from-another-table
    let query1 = `SELECT t1.*,
            (
                SELECT sum(t2.itemTotalAmount)
                FROM OrdersWithItems as t2
                WHERE t2.orderID = t1.orderID
            ) as totalAmount
        FROM Orders as t1;`
    let query2 = "SELECT * FROM Restaurants;"
    let query3 = "SELECT * FROM Patrons;"

    // Run the 1st query
    db.pool.query(query1, function(error, rows, fields){
        let orders = rows;

        db.pool.query(query2, function(error, rows, fields) {
            let restaurants = rows

            db.pool.query(query3, function(error, rows, fields) {
                let patrons = rows

                let restaurantMap = {}
                restaurants.map(restaurant => {
                    let id = parseInt(restaurant.restaurantID, 10);
    
                    restaurantMap[id] = restaurant["location"];
                })

                let patronMap = {}
                patrons.map(patron => {
                    let id = parseInt(patron.patronID, 10);
    
                    patronMap[id] = patron["name"];
                })
    
                // Overwrite the homeworld ID with the name of the planet in the people object
                orders = orders.map(order => {
                    return Object.assign(order, {restaurantName: restaurantMap[order.restaurantID], patronName: patronMap[order.patronID]})
                })



                return res.render('orders', {orders: orders, restaurants: restaurants, patrons: patrons})
            })
        })
    })
});

app.post('/add-orders-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let restaurantID = parseInt(data.restaurantID)
    let patronID = parseInt(data.patronID)

    // Create the query and run it on the database
    query1 = `INSERT INTO Orders (restaurantID, patronID, orderDate) VALUES (${restaurantID}, ${patronID}, '${data['orderDate']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            query2 = `SELECT * FROM Orders`;

            db.pool.query(query2, function(error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                } else {
                    res.send(rows);
                }
            })
        }
    })
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







/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});