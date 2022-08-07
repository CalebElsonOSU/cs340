// Adapted from class demo project: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/
var express = require('express')   // We are using the express library for the web server
var app     = express()            // We need to instantiate an express object to interact with the server in our code
PORT        = 8746                 // Set a port number at the top so it's easy to change in the future

const { engine } = require('express-handlebars')
var exphbs = require('express-handlebars');    // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}))  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs')                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

// Database
var db = require('./database/db-connector')

// Handlebars helpers
var helpers = require('handlebars-helpers')()

// app.js - SETUP section
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))         // this is needed to allow for the form to use the ccs style sheet/javscript


/*
    index
*/
app.get('/', function (req, res) {
    res.render('index')
})




/*
    patrons
*/
app.get('/patrons', function (req, res) {
    // Declare query
    let query = "SELECT * FROM Patrons"

    // Run the query
    db.pool.query(query, function(error, rows, fields) {
        return res.render('patrons', {patrons: rows})
    })
});

app.post('/add-patrons-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
    query1 = `INSERT INTO Patrons (name, phoneNum, address) VALUES ('${data['name']}', '${data['phoneNum']}', '${data['address']}');`;
    db.pool.query(query1, function(error, rows, fields) {

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400)
        } else {
            res.send()
        }
    })
});




/*
    orders
*/
app.get('/orders', function (req, res) {
    // Declare queries
    // Adapted from https://stackoverflow.com/questions/64525959/sql-query-to-sum-values-from-column-using-the-same-id-from-another-table
    let queryOrders = `SELECT t1.*,
            (
                SELECT sum(t2.itemTotalAmount)
                FROM OrdersWithItems as t2
                WHERE t2.orderID = t1.orderID
            ) as totalAmount
        FROM Orders as t1;`
    let queryRestaurants = "SELECT * FROM Restaurants;"
    let queryPatrons = "SELECT * FROM Patrons;"

    // Run the 1st query
    db.pool.query(queryOrders, function(error, rows, fields) {
        let orders = rows;

        db.pool.query(queryRestaurants, function(error, rows, fields) {
            let restaurants = rows

            db.pool.query(queryPatrons, function(error, rows, fields) {
                let patrons = rows

                let restaurantMap = {}
                restaurants.map(restaurant => {
                    let id = parseInt(restaurant.restaurantID, 10)
    
                    restaurantMap[id] = restaurant["location"]
                })

                let patronMap = {}
                patrons.map(patron => {
                    let id = parseInt(patron.patronID, 10)
    
                    patronMap[id] = patron["name"]
                })
    
                // Add restaraunt and patron's names as columns to orders object
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
    let data = req.body

    let restaurantID = parseInt(data.restaurantID)
    let patronID = parseInt(data.patronID)

    // Create the query and run it on the database, inserting new order
    query = `INSERT INTO Orders (restaurantID, patronID, orderDate) VALUES (${restaurantID}, ${patronID}, '${data['orderDate']}')`
    db.pool.query(query, function(error, rows, fields) {

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        } else {
            res.send()
        }
    })
});

app.delete('/delete-orders-ajax', function(req,res,next){
    let data = req.body
    let orderID = parseInt(data.orderID)
    let queryDeleteOrders = `DELETE FROM Orders WHERE orderID = ?`
  
    // Run the 1st query
    db.pool.query(queryDeleteOrders, orderID, function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400)
        } else {
            res.sendStatus(200)
        }
    })
});




/*
    restaurants
*/
app.get('/restaurants', function (req, res) {
    // Declare query
    let query = "SELECT * FROM Restaurants"

    // Run the query
    db.pool.query(query, function(error, rows, fields) {
        return res.render('restaurants', {restaurants: rows})
    })
});

app.post('/add-restaurants-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body

    // Create the query and run it on the database
    let query = `INSERT INTO Restaurants (location, phoneNum, hours) VALUES ('${data['location']}', '${data['phoneNum']}', '${data['hours']}');`
    db.pool.query(query, function(error, rows, fields) {

        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400)
        } else {
            res.send()
        }
    })
});




/*
    employees
*/
app.get('/employees', function (req, res) {
    // Declare queries
    // LEFT JOIN as null values should still be showed
    let queryEmployees = `SELECT employeeID, name, Roles.roleName, pay
        FROM Employees 
        LEFT JOIN Roles ON Employees.roleID = Roles.roleID;`
    let queryRoles = "SELECT * FROM Roles"

    // Run query
    db.pool.query(queryEmployees, function(error, rows, fields) {
        let employees = rows

        db.pool.query(queryRoles, function(error, rows, fields) {
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

    // Create the query and run it on the database, inserting new employee
    query = `INSERT INTO Employees (name, roleID, pay) VALUES ('${data['name']}', ${roleID}, ${pay});`;
    db.pool.query(query, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            res.send()
        }
    })
});

app.put('/put-employees-ajax', function(req,res,next) {                                   
    let data = req.body

    let employeeID = parseInt(data.employeeID)
    let roleID = parseInt(data.roleID)
    if (isNaN(roleID))
    {
        roleID = 'NULL'
    }
    let pay = parseFloat(data.pay)
    if (isNaN(pay))
    {
        pay = 'NULL'
    }
  
    // Adapted from discussion here: https://edstem.org/us/courses/23076/discussion/1660701
    let queryRoleIDUpdate = `UPDATE Employees SET roleID = NULLIF(?, 'NULL') WHERE (Employees.employeeID = ?);`
    let queryPayUpdate = `UPDATE Employees SET pay = NULLIF(?, 'NULL') WHERE (Employees.employeeID = ?);`
  
    // Run the 1st query, updating the roleID
    db.pool.query(queryRoleIDUpdate, [roleID, employeeID], function(error, rows, fields){
        if (error) {
        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error)
        res.sendStatus(400)
        }
        // If there was no error, we run our second query, updating the pay column
        else
        {
            // Run the second query
            db.pool.query(queryPayUpdate, [pay, employeeID], function(error, rows, fields) {
                if (error) {
                    console.log(error)
                    res.sendStatus(400)
                } else {
                    res.send()
                }
            })
        }
  })});




/*
    items
*/
app.get('/items', function (req, res) {
    // Declare query
    let query = "SELECT * FROM Items"

    // Run the query
    db.pool.query(query, function(error, rows, fields){
        return res.render('items', {items: rows});
    })
});

app.post('/add-items-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body

    let itemPrice = parseFloat(data.itemPrice)

    // Create the query and run it on the database
    query1 = `INSERT INTO Items (name, itemPrice) VALUES ('${data['name']}', ${itemPrice})`
    db.pool.query(query1, function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(401)
        }
        else
        {
            res.send()
        }
    })
});




/*
    roles
*/
app.get('/roles', function (req, res) {
    // Declare query
    let query = "SELECT * FROM Roles"

    // Run the query
    db.pool.query(query, function(error, rows, fields){
        return res.render('roles', {roles: rows})
    })
});

app.post('/add-roles-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body

    // Create the query and run it on the database
    query1 = `INSERT INTO Roles (roleName) VALUES ('${data['roleName']}');`
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(401);
        }
        else
        {
            res.send()
        }
    })
});




/*
    ordersWithItems
*/
app.get('/ordersWithItems', function(req, res) {
    // Declare queries
    let queryOrdersWithItems = "SELECT * FROM OrdersWithItems;"
    let queryOrders = "SELECT * FROM Orders;"
    let queryItems = "SELECT * FROM Items;"


    // Run the 1st query
    db.pool.query(queryOrdersWithItems, function(error, rows, fields){
        // Save the items
        let ordersWithItems = rows

        db.pool.query(queryOrders, function(error, rows, fields) {
            let orders = rows

            db.pool.query(queryItems, function(error, rows, fields) {
                let items = rows

                let itemMap = {}
                items.map(item => {
                    let id = parseInt(item.itemID, 10)
    
                    itemMap[id] = item["name"]
                })
    
                // Add itemName column to ordersWithItems object
                ordersWithItems = ordersWithItems.map(owi => {
                    return Object.assign(owi, {itemName: itemMap[owi.itemID]})
                })

                return res.render('ordersWithItems', {ordersWithItems: ordersWithItems, orders: orders, items: items})
            })
        })
    })
});

app.post('/add-ordersWithItems-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body

    let orderID = parseInt(data.orderID)
    let itemID = parseInt(data.itemID)
    let itemQuantity = parseInt(data.itemQuantity)
    let itemTotalAmount = parseFloat(data.itemTotalAmount)

    // Create the query and run it on the database, adding new OrdersWithItems
    query = `INSERT INTO OrdersWithItems (orderID, itemID, itemQuantity, itemTotalAmount) VALUES (${orderID}, ${itemID}, ${itemQuantity}, ${itemTotalAmount})`
    db.pool.query(query, function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(401)
        } else {
            res.send()
        }
    })
});

app.delete('/delete-ordersWithItems-ajax/', function(req,res,next){
    let data = req.body
    let itemID = parseInt(data.itemID)
    let orderID = parseInt(data.orderID)
    let deleteOrdersWithItems = `DELETE FROM OrdersWithItems WHERE itemID = ? AND orderID = ?`
  
    // Run the 1st query
    db.pool.query(deleteOrdersWithItems, [itemID, orderID], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400)
        } else {
            // Successfully deleted
            res.sendStatus(200)
        }
    })
});
  
  app.put('/put-orderWithItems-ajax', function(req,res,next){                                   
    let data = req.body
  
    let orderID = parseInt(data.orderID)
    let itemID = parseInt(data.itemID)
    let itemQuantity = parseInt(data.itemQuantity)
    let itemTotalAmount = parseFloat(data.itemTotalAmount)
  
    let queryUpdateItemQuantity = `UPDATE OrdersWithItems SET itemQuantity = ? WHERE (OrdersWithItems.orderID = ? AND OrdersWithItems.itemID = ?);`
    let queryUpdateItemTotalAmount = `UPDATE OrdersWithItems SET itemTotalAmount = ? WHERE (OrdersWithItems.orderID = ? AND OrdersWithItems.itemID = ?);`
  
          // Run the 1st query, updating itemQuantity
          db.pool.query(queryUpdateItemQuantity, [itemQuantity, orderID, itemID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error)
              res.sendStatus(400)
              }
  
              // If there was no error, we run our second query and update itemTotalAmount
              else
              {
                  // Run the second query
                  db.pool.query(queryUpdateItemTotalAmount, [itemTotalAmount, orderID, itemID], function(error, rows, fields) {
                      if (error) {
                          console.log(error)
                          res.sendStatus(400)
                      } else {
                          res.send()
                      }
                  })
              }
  })});




/*
    restaurantsWithEmployees
*/
app.get('/restaurantsWithEmployees', function (req, res) {
    // Declare queries
    // Left join as we want null values
    let queryRestaurantsWithEmployees = `SELECT RestaurantsWithEmployees.employeeID, restaurantID, Roles.roleName
    FROM RestaurantsWithEmployees 
    INNER JOIN Employees ON RestaurantsWithEmployees.employeeID = Employees.employeeID
    LEFT JOIN Roles ON Employees.roleID = Roles.roleID
    ORDER BY restaurantID;`
    let queryEmployees = `SELECT employeeID, name, Roles.roleName
    FROM Employees
    LEFT JOIN Roles ON Roles.roleID = Employees.roleID;`
    let queryRestaurants = "SELECT * FROM Restaurants;"



    // Run the 1st query
    db.pool.query(queryRestaurantsWithEmployees, function(error, rows, fields){
        
        // Save the items
        let restaurantsWithEmployees = rows

        db.pool.query(queryEmployees, function(error, rows, fields) {
            let employees = rows

            db.pool.query(queryRestaurants, function(error, rows, fields) {
                let restaurants = rows

                //  Manipulating objects instead of including in a single query as Employees and Restaurants tables are used on the page
                //  Add restaurant name to restaurantsWithEmployees object
                let restaurantMap = {}
                restaurants.map(restaurant => {
                    let id = parseInt(restaurant.restaurantID, 10)
    
                    restaurantMap[id] = restaurant["location"]
                })
                restaurantsWithEmployees = restaurantsWithEmployees.map(rwe => {
                    return Object.assign(rwe, {restaurantName: restaurantMap[rwe.restaurantID]})
                })

                // Add employee name to restaurantsWithEmployees object
                let employeeMap = {}
                employees.map(employee => {
                    let id = parseInt(employee.employeeID, 10)

                    employeeMap[id] = employee["name"]
                })
                restaurantsWithEmployees = restaurantsWithEmployees.map(rwe => {
                    return Object.assign(rwe, {employeeName: employeeMap[rwe.employeeID]})
                })


                return res.render('restaurantsWithEmployees', {restaurantsWithEmployees: restaurantsWithEmployees, employees: employees, restaurants: restaurants})
            })
        })
    })
});

app.post('/add-restaurantsWithEmployees-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let restaurantID = parseInt(data.restaurantID)
    let employeeID = parseInt(data.employeeID)

    // Create the query and run it on the database
    let queryRestaurantsWithEmployees = `INSERT INTO RestaurantsWithEmployees (restaurantID, employeeID) VALUES (${restaurantID}, ${employeeID})`;
    db.pool.query(queryRestaurantsWithEmployees, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(401)
        }
        else
        {
            res.send()
        }
    })
});




/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});