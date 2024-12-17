const express = require("express");
const mysql = require("mysql2");
const cors = require("cors"); // Import the cors middleware

const app = express();

// Middleware to parse JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0000', // Replace with your MySQL password
  });

/*app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST","DELETE","PUT"],       
  credentials: true,              
}));*/

//CORS Header otherwise my browser block it
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); 
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
  next();
});

app.get("/dishes", (req, res) => {
  db.query("SELECT * FROM Dish", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error fetching dishes");
    } else {
      res.json(results);
    }
  });
});

// Endpoint to handle login
app.post('/login', (req, res) => {
  console.log("POST /login called");
    const { username, password } = req.body;
  
    const loginQuery = `
     SELECT 'admin' AS role FROM Manager 
WHERE ManagerName = ? AND ManagerPassword = ?
UNION
SELECT 'user' AS role FROM Waiter 
WHERE waiterName = ? AND waiterPassword = ?;

    `;
  
    db.query(loginQuery, [username, password, username, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error during login' });
        }
    
        const role = results[0]?.role;
    
        if (role) {
            res.status(200).json({ message: 'Login successful', role });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});

// Endpoint to fetch managers
app.get("/managers", (req, res) => {
    db.query("SELECT * FROM Manager", (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching managers");
      } else {
        res.json(results);
      }
    });
  });
  
// Endpoint to fetch waiters
app.get("/waiters", (req, res) => {
    db.query("SELECT * FROM Waiter", (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error fetching waiters");
      } else {
        res.json(results);
      }
    });
  });
  
  // Add a new manager
app.post("/managers", (req, res) => {
    const { name, password } = req.body;
    const insertQuery = `INSERT INTO Manager (ManagerName, ManagerPassword) VALUES (?, ?)`;
    db.query(insertQuery, [name, password], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error adding manager");
      } else {
        res.status(201).send("Manager added successfully");
      }
    });
  });
  
  // Delete a manager
app.delete("/managers/:id", (req, res) => {
    const managerId = req.params.id;
    const deleteQuery = `DELETE FROM Manager WHERE managerId = ?`;
    db.query(deleteQuery, [managerId], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error deleting manager");
      } else {
        res.status(200).send("Manager deleted successfully");
      }
    });
  });
  

  // Add a new waiter
app.post("/waiters", (req, res) => {
    const { name, password } = req.body;
    const insertQuery = `INSERT INTO Waiter (waiterName, waiterPassword) VALUES (?, ?)`;
    db.query(insertQuery, [name, password], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error adding waiter");
      } else {
        res.status(201).send("Waiter added successfully");
      }
    });
  });
 
  // Endpoint to add a new dish
app.post("/dishes", (req, res) => {
    const { dishName, ingredientList, allergenesList, dishPrice, imagePath } = req.body;
    const insertQuery = `INSERT INTO Dish (dishName, ingredientList, allergenesList, dishPrice, dishAvailable, imagePath) 
                         VALUES (?, ?, ?, ?, true, ?)`;
    db.query(insertQuery, [dishName, ingredientList, allergenesList, dishPrice, imagePath], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error adding dish");
      } else {
        res.status(201).send("Dish added successfully");
      }
    });
  });
  
  // Delete a waiter
app.delete("/waiters/:id", (req, res) => {
    const waiterId = req.params.id;
    const deleteQuery = `DELETE FROM Waiter WHERE waiterId = ?`;
    db.query(deleteQuery, [waiterId], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error deleting waiter");
      } else {
        res.status(200).send("Waiter deleted successfully");
      }
    });
  });
  

// Endpoint to delete a dish
app.delete('/dishes/:id', (req, res) => {
    const dishID = req.params.id;
    const deleteDishQuery = `DELETE FROM Dish WHERE dishID = ?`;

    db.query(deleteDishQuery, [dishID], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete the dish' });
      }
      res.status(200).json({ message: 'Dish deleted successfully' });
    });
  });

  app.listen(3000, () => console.log("Server running on http://localhost:3000"));


con.connect(function (err) {
  if (err) {
    console.error("Error connecting:", err.message);
    return;
  }
  console.log("Connected!");

  // Create the database
  con.query("CREATE DATABASE IF NOT EXISTS restaurant_db", function (err, result) {
    if (err) throw err;
    console.log("Database restaurant_db ensured!");

    // Switch to the newly created database
    con.changeUser({ database: 'restaurant_db' }, function (err) {
      if (err) throw err;

      // Create tables
      const dishTable = `CREATE TABLE IF NOT EXISTS Dish (
          dishID INT AUTO_INCREMENT PRIMARY KEY,
          dishName VARCHAR(255) NOT NULL,
          ingredientList VARCHAR(255) NOT NULL,
          allergenesList VARCHAR(255),
          dishPrice INT NOT NULL,
          dishAvailable BOOLEAN DEFAULT TRUE,
          imagePath VARCHAR(255)
      )`;

      const managerTable = `CREATE TABLE IF NOT EXISTS Manager (
          managerId INT AUTO_INCREMENT PRIMARY KEY,
          ManagerName VARCHAR(255) NOT NULL,
          ManagerPassword VARCHAR(255) NOT NULL
      )`;

      const waiterTable = `CREATE TABLE IF NOT EXISTS Waiter (
          waiterId INT AUTO_INCREMENT PRIMARY KEY,
          waiterName VARCHAR(255) NOT NULL,
          waiterPassword VARCHAR(255) NOT NULL
      )`;

      // Execute table creation queries
      con.query(dishTable, function (err) {
        if (err) throw err;
        console.log("Table Dish ensured!");

        // Insert dishes into the Dish table
        const dishes = [
          ['Margherita Pizza', 'Flour, Tomato Sauce, Mozzarella', 'Gluten, Dairy', 10, true, '/images/margherita_pizza.jpg'],
          ['Classic Burger', 'Bun, beef, lettuce, tomato, cheese', 'Gluten, lactose', 11, true, 'images/classic_burger.jpg'],
          ['Croque Monsieur', 'Bread, ham, cheese, béchamel', 'Gluten, lactose', 7, true, 'images/croque_monsieur.jpg'],
          ['Quiche Lorraine', 'Eggs, cream, bacon, shortcrust pastry', 'Gluten, eggs, lactose', 8, true, 'images/quiche_lorraine.jpg'],
          ['Lasagna', 'Pasta, beef, tomato sauce, béchamel', 'Gluten, lactose', 12, true, 'images/lasagna.jpg'],
          ['Spaghetti Bolognese', 'Spaghetti, Beef, Tomato Sauce', 'Gluten', 12, true, '/images/bolonese.jpg'],
          ['Spaghetti Carbonara', 'Pasta, eggs, pancetta, parmesan, pepper', 'Gluten, eggs, lactose', 12, true, 'images/carbonara.jpg'],
          ['Steak and Fries', 'Beef, potatoes, salt', null, 15, true, 'images/steak_fries.jpg'],
          ['Caesar Salad', 'Lettuce, Croutons, Parmesan, Caesar Dressing', 'Dairy, Gluten', 8, true, '/images/caesar_salad.jpg'],
          ['Ratatouille', 'Eggplant, zucchini, tomatoes, peppers, onions', null, 8, true, 'images/ratatouille.jpg'],
          ['Paella', 'Rice, chicken, seafood, saffron', 'Shellfish', 18, true, 'images/paella.jpg'],
          ['Chicken Tikka Masala', 'Chicken, Cream, Spices', 'Dairy', 15, true, '/images/chicken_tikka.jpg'],
          ['Dark Forest', 'Flour, Cocoa, Sugar, Eggs, Chocolate, Cherry', 'Gluten, Eggs, Dairy', 6, true, '/images/darkforest.jpg'],
          ['Apple Pie', 'Apples, sugar, cinnamon, butter, pastry', 'Gluten, lactose', 6, true, 'images/apple_pie.jpg'],
          ['Dame Blanche', 'Vanilla ice cream, chocolate sauce, whipped cream', 'Lactose', 7, true, 'images/dame_blanche.jpg']
        ];

        const insertDishQuery = `INSERT INTO Dish (dishName, ingredientList, allergenesList, dishPrice, dishAvailable, imagePath) 
          VALUES (?, ?, ?, ?, ?, ?)`;

        Promise.all(
          dishes.map(dish =>
            new Promise((resolve, reject) => {
              con.query(insertDishQuery, dish, (err, result) => {
                if (err) {
                  console.error("Error inserting dish:", err.message);
                  reject(err);
                } else {
                  console.log(`Inserted dish: ${dish[0]}`);
                  resolve(result);
                }
              });
            })
          )
        )
          .then(() => {
            console.log("All dishes inserted successfully.");
            closeConnection();
          })
          .catch(err => {
            console.error("Error inserting dishes:", err);
            closeConnection();
          });
      });

      con.query(managerTable, function (err) {
        if (err) throw err;
        console.log("Table Manager ensured!");
      });

      con.query(waiterTable, function (err) {
        if (err) throw err;
        console.log("Table Waiter ensured!");
      });

      // Insert managers into the Manager table
      const managers = [
        ['MaximeTang', 'Tang'],
        ['TiphaineFournier', 'Fournier'],
        ['AlexandreGobe','Gobe']
      ];
  
    const insertManagerQuery = `INSERT INTO Manager (ManagerName, ManagerPassword) VALUES (?, ?)`;
    
    Promise.all(
        managers.map(manager =>
        new Promise((resolve, reject) => {
            con.query(insertManagerQuery, manager, (err, result) => {
            if (err) {
                console.error("Error inserting manager:", err.message);
                reject(err);
            } else {
                console.log(`Inserted manager: ${manager[0]}`);
                resolve(result);
            }
            });
        })
        )
    ).then(() => {
        console.log("All managers inserted successfully.");
    }).catch(err => {
        console.error("Error inserting managers:", err);
    });
    
    // Insert waiters into the Waiter table
    const waiters = [
      ['SamuelDoyen', 'Doyen'],
      ['ThibaultBial', 'Bial'],
      ['JonathanAyeto', 'Ayeto'],
      ['MathisBeurotte','Beurotte']
    ];
    
    const insertWaiterQuery = `INSERT INTO Waiter (waiterName, waiterPassword) VALUES (?, ?)`;
    
    Promise.all(
        waiters.map(waiter =>
        new Promise((resolve, reject) => {
            con.query(insertWaiterQuery, waiter, (err, result) => {
            if (err) {
                console.error("Error inserting waiter:", err.message);
                reject(err);
            } else {
                console.log(`Inserted waiter: ${waiter[0]}`);
                resolve(result);
            }
            });
        })
        )
    ).then(() => {
        console.log("All waiters inserted successfully.");
    }).catch(err => {
        console.error("Error inserting waiters:", err);
    });

      // Close connection in a separate function
      function closeConnection() {
        con.end(err => {
          if (err) {
            console.error("Error closing connection:", err.message);
          } else {
            console.log("Connection closed.");
          }
        });
      }
    });
  });
});
