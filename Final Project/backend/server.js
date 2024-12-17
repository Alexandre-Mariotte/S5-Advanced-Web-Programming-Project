const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0000",
    database: "restaurant_db"
});

con.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }
    console.log("Connected to database");
});

// ---------------------- ROUTES ----------------------

// CORS headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

// LOGIN route
app.post("/login", (req, res) => {
    console.log("POST /login called");
    const { username, password } = req.body;

    const loginQuery = `
        SELECT 'admin' AS role FROM Manager WHERE ManagerName = ? AND ManagerPassword = ?
        UNION
        SELECT 'user' AS role FROM Waiter WHERE waiterName = ? AND waiterPassword = ?;
    `;

    con.query(loginQuery, [username, password, username, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error during login" });
        }

        const role = results[0]?.role;
        if (role) {
            res.status(200).json({ message: "Login successful", role });
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    });
});

// Fetch all managers
app.get("/managers", (req, res) => {
    con.query("SELECT * FROM Manager", (err, results) => {
        if (err) return res.status(500).send("Error fetching managers");
        res.json(results);
    });
});

// Fetch all waiters
app.get("/waiters", (req, res) => {
    con.query("SELECT * FROM Waiter", (err, results) => {
        if (err) return res.status(500).send("Error fetching waiters");
        res.json(results);
    });
});

// Add a new manager
app.post("/managers", (req, res) => {
    const { name, password } = req.body;
    const insertQuery = `INSERT INTO Manager (ManagerName, ManagerPassword) VALUES (?, ?)`;
    con.query(insertQuery, [name, password], (err, results) => {
        if (err) return res.status(500).send("Error adding manager");
        res.status(201).send("Manager added successfully");
    });
});

// Delete a manager
app.delete("/managers/:id", (req, res) => {
    const managerId = req.params.id;
    const deleteQuery = `DELETE FROM Manager WHERE managerId = ?`;
    con.query(deleteQuery, [managerId], (err, results) => {
        if (err) return res.status(500).send("Error deleting manager");
        res.status(200).send("Manager deleted successfully");
    });
});

// Add a new waiter
app.post("/waiters", (req, res) => {
    const { name, password } = req.body;
    const insertQuery = `INSERT INTO Waiter (waiterName, waiterPassword) VALUES (?, ?)`;
    con.query(insertQuery, [name, password], (err, results) => {
        if (err) return res.status(500).send("Error adding waiter");
        res.status(201).send("Waiter added successfully");
    });
});

// Delete a waiter
app.delete("/waiters/:id", (req, res) => {
    const waiterId = req.params.id;
    const deleteQuery = `DELETE FROM Waiter WHERE waiterId = ?`;
    con.query(deleteQuery, [waiterId], (err, results) => {
        if (err) return res.status(500).send("Error deleting waiter");
        res.status(200).send("Waiter deleted successfully");
    });
});

// Fetch all dishes
app.get("/dishes", (req, res) => {
    con.query("SELECT * FROM Dish", (err, results) => {
        if (err) return res.status(500).send("Error fetching dishes");
        res.json(results);
    });
});

// Add a new dish
app.post("/dishes", (req, res) => {
    const { dishName, ingredientList, allergenesList, dishPrice, imagePath } = req.body;
    const insertQuery = `INSERT INTO Dish (dishName, ingredientList, allergenesList, dishPrice, dishAvailable, imagePath) 
                         VALUES (?, ?, ?, ?, true, ?)`;
    con.query(insertQuery, [dishName, ingredientList, allergenesList, dishPrice, imagePath], (err, results) => {
        if (err) return res.status(500).send("Error adding dish");
        res.status(201).send("Dish added successfully");
    });
});

// Delete a dish
app.delete("/dishes/:id", (req, res) => {
    const dishID = req.params.id;
    const deleteDishQuery = `DELETE FROM Dish WHERE dishID = ?`;
    con.query(deleteDishQuery, [dishID], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to delete the dish" });
        res.status(200).json({ message: "Dish deleted successfully" });
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
