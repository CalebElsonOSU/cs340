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
  `totalAmount` decimal(19,4) NOT NULL,
  `orderDate` date DEFAULT NULL,
  PRIMARY KEY (`orderID`),
  FOREIGN KEY (restaurantID) references Restaurants(restaurantID) ON DELETE CASCADE,
  FOREIGN KEY (patronID) references Patrons(patronID) ON DELETE CASCADE
);

CREATE OR REPLACE TABLE `OrdersWithItems` (
  `orderID` int NOT NULL,
  `itemID` int NOT NULL,
  PRIMARY KEY (orderID, itemID),
  FOREIGN KEY (orderID) references Orders(orderID),
  FOREIGN KEY (itemID) references Items(itemID),
  itemQuantity int NOT NULL,
  itemTotalAmount decimal(19,4) NOT NULL
);

CREATE OR REPLACE TABLE `Restaurants` (
  `restaurantID` int NOT NULL UNIQUE AUTO_INCREMENT,
  `itemID` int NOT NULL,
  `location` varchar(255) NOT NULL,
  `phoneNum` varchar(255) NOT NULL,
  `hours` varchar(255) NOT NULL,
  PRIMARY KEY (`restaurantID`),
  FOREIGN KEY (itemID) references Items(itemID) ON DELETE CASCADE
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
  `restaurantID` int,
  PRIMARY KEY (`itemID`),
  FOREIGN KEY (restaurantID) references Restaurants(restaurantID) ON DELETE CASCADE
);

CREATE OR REPLACE TABLE `Roles` (
  `roleID` int NOT NULL UNIQUE AUTO_INCREMENT,
  `roleName` varchar(255) NOT NULL,
  PRIMARY KEY (`roleID`)
);

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

INSERT INTO Orders (
  restaurantID,
  patronID,
  orderDate,
  totalAmount
)
VALUES 
(
  "0",
  "1",
  "2022-07-11",
  "28.44"
),
(
  "1",
  "2",
  "2022-03-28",
  "17.90"
),
(
  "0",
  "0",
  "2022-04-22",
  "38.10"
);

INSERT INTO OrdersWithItems (
  orderID,
  itemID,
  itemQuantity,
  itemTotalAmount
)
VALUES 
(
  "1",
  "0",
  "2",
  "28.44"
),
(
  "2",
  "2",
  "1",
  "17.90"
),
(
  "3",
  "1",
  "3",
  "38.10"
);


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

INSERT INTO RestaurantsWithEmployees (
  employeeID,
  restaurantID
)
VALUES 
(
  "0",
  "0"
),
(
  "1",
  "0"
),
(
  "2",
  "1"
);

INSERT INTO OrdersWithRestaurants (
  orderID,
  restaurantID
)
VALUES 
(
  "0",
  "0"
),
(
  "1",
  "0"
),
(
  "2",
  "1"
);

INSERT INTO Employees (
    name,
    roleID,
    pay
)
VALUES 
(
    "Judd Artie",
    "0",
    "22.22"
),
(
    "Jemma Corina",
    "1",
    "18.70"
),
(
    "Hudson Dana",
    NULL,
    NULL
);

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