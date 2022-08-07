SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

CREATE OR REPLACE TABLE `Patrons` (
  `patronID` int NOT NULL UNIQUE AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phoneNum` varchar(255),
  `address` varchar(255),
  PRIMARY KEY (`patronID`)
);

CREATE OR REPLACE TABLE `Orders` (
  `orderID` int NOT NULL UNIQUE AUTO_INCREMENT,
  `restaurantID` int NOT NULL,
  `patronID` int NOT NULL,
  `orderDate` date DEFAULT NULL,
  PRIMARY KEY (`orderID`),
  FOREIGN KEY (restaurantID) references Restaurants(restaurantID) ON DELETE CASCADE,
  FOREIGN KEY (patronID) references Patrons(patronID) ON DELETE CASCADE
);

CREATE OR REPLACE TABLE `OrdersWithItems` (
  `orderID` int NOT NULL,
  `itemID` int NOT NULL,
  PRIMARY KEY (orderID, itemID),
  FOREIGN KEY (orderID) references Orders(orderID) ON DELETE CASCADE,
  FOREIGN KEY (itemID) references Items(itemID) ON DELETE CASCADE,
  itemQuantity int NOT NULL,
  itemTotalAmount decimal(19,4) NOT NULL
);

CREATE OR REPLACE TABLE `Restaurants` (
  `restaurantID` int NOT NULL UNIQUE AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  `phoneNum` varchar(255) NOT NULL,
  `hours` varchar(255) NOT NULL,
  PRIMARY KEY (`restaurantID`)
);

CREATE OR REPLACE TABLE `OrdersWithRestaurants` (
  `orderID` int NOT NULL,
  `restaurantID` int Not Null,
  PRIMARY KEY (orderID, restaurantID),
  FOREIGN KEY (orderID) references Orders(orderID),
  FOREIGN KEY (restaurantID) references Restaurants(restaurantID)
);

CREATE OR REPLACE TABLE `Employees` (
  `employeeID` int NOT NULL UNIQUE AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `roleID` int,
  `pay` decimal(19,4),
  PRIMARY KEY (`employeeID`),
  FOREIGN KEY (roleID) references Roles(roleID) ON DELETE CASCADE
);

CREATE OR REPLACE TABLE `RestaurantsWithEmployees` (
  `employeeID` int NOT NULL,
  `restaurantID` int Not Null,
  PRIMARY KEY (employeeID, restaurantID),
  FOREIGN KEY (restaurantID) references Restaurants(restaurantID) ON DELETE CASCADE,
  FOREIGN KEY (employeeID) references Employees(employeeID) ON DELETE CASCADE
);

CREATE OR REPLACE TABLE `Items` (
  `itemID` int NOT NULL UNIQUE AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `itemPrice` decimal(19,4) NOT NULL,
  PRIMARY KEY (`itemID`)
);

CREATE OR REPLACE TABLE `Roles` (
  `roleID` int NOT NULL UNIQUE AUTO_INCREMENT,
  `roleName` varchar(255) NOT NULL,
  PRIMARY KEY (`roleID`)
);

-- Insert sample Patrons
INSERT INTO Patrons (
  name,
  phoneNum,
  address
)
VALUES 
(
  "Joe Smith",
  "555-123-4567",
  "123 Main St"
),
(
  "Becky Shultz",
  "4779876543",
  "44 George St"
),
(
  "Jenny Sanders",
  "(455) 444-8888",
  "1208 S Brooklyn Ave"
);

-- Insert sample Orders
INSERT INTO Orders (
  restaurantID,
  patronID,
  orderDate
)
VALUES 
(
  "1",
  "2",
  "2022-07-11"
),
(
  "2",
  "3",
  "2022-03-28"
),
(
  "3",
  "1",
  "2022-04-22"
);

-- Insert sample values to the intersection table between Orders and Items
INSERT INTO OrdersWithItems (
  orderID,
  itemID,
  itemQuantity,
  itemTotalAmount
)
VALUES 
(
  "1",
  "1",
  "2",
  "28.44"
),
(
  "2",
  "3",
  "1",
  "17.90"
),
(
  "3",
  "2",
  "3",
  "38.10"
);

-- Insert sample Restaurants
INSERT INTO Restaurants (
  location,
  phoneNum,
  hours
)
VALUES 
(
  "south central",
  "3559870456",
  "10am-11pm"
),
(
  "east village",
  "3559871234",
  "10am-2am"
),
(
  "alameda",
  "3559874444",
  "10am-10pm"
);

-- Insert sample values to the intersection table between Restaurants and Employees
INSERT INTO RestaurantsWithEmployees (
  employeeID,
  restaurantID
)
VALUES 
(
  "1",
  "3"
),
(
  "2",
  "2"
),
(
  "3",
  "1"
);

-- Insert sample values to the intersection table between Orders and Restaurants
INSERT INTO OrdersWithRestaurants (
  orderID,
  restaurantID
)
VALUES 
(
  "3",
  "2"
),
(
  "1",
  "3"
),
(
  "2",
  "1"
);

-- Insert sample Employees, both roleID and pay are nullable
INSERT INTO Employees (
    name,
    roleID,
    pay
)
VALUES 
(
    "Judd Artie",
    "1",
    "22.22"
),
(
    "Jemma Corina",
    "2",
    "18.70"
),
(
    "Hudson Dana",
    NULL,
    NULL
);

-- Insert sample Items
INSERT INTO Items (
  name,
  itemPrice
)
VALUES 
(
  "Pepperoni",
  "14.22"
),
(
  "Cheese",
  "12.70"
),
(
  "Supreme",
  "17.90"
);

-- Insert sample Roles
INSERT INTO Roles (
    roleName
)
VALUES 
(
    "Driver"
),
(
    "Server"
),
(
    "Cook"
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;