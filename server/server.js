const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost", // Your database host
  user: "root", // Your database username
  password: "user123@@@", // Your database password
  database: "users", // Your database name
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database.");
});

// Define API routes


// GET request - fetch all user groups
app.get("/api/userGroups", (req, res) => {
  const query = "SELECT * FROM usergroups ORDER BY id ASC";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err); // Log the specific error
      return res.status(500).json({ error: "Database query error." });
    }
    res.json(results);
  });
});

// GET request - fetch all users
app.get("/api/users", (req, res) => {
  const query = "SELECT * FROM users ORDER BY id";
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database query error." });
    }
    res.json(results);
  });
});

// POST request - add a new user
app.post("/api/users", (req, res) => {
  const { name, userGroup } = req.body;

  if (!name || !userGroup) {
    return res.status(400).json({ error: "Name and userGroup are required." });
  }

  const query = "INSERT INTO users (name, userGroup) VALUES (?, ?)";
  connection.query(query, [name, userGroup], (err, result) => {
    if (err) {
      console.error("Error inserting into the database:", err); // Log the actual error
      return res.status(500).json({ error: "Database insert error.", details: err.message });
    }
    const newUser = { id: result.insertId, name, userGroup }; // Use the auto-incremented ID from the database
    res.status(201).json(newUser);
  });
});

// POST request - add a new user group
app.post("/api/userGroups", (req, res) => {
  const { userGroup } = req.body;

  if (!userGroup) {
    return res.status(400).json({ error: "User group is required." });
  }

  const query = "INSERT INTO usergroups (name) VALUES (?)";
  connection.query(query, [userGroup], (err, result) => {
    if (err) {
      console.error("Error inserting into the database:", err); // Log the actual error
      return res.status(500).json({ error: "Database insert error.", details: err.message });
    }
    const newUserGroup = { id: result.insertId, name: userGroup }; // Use the auto-incremented ID from the database
    res.status(201).json(newUserGroup);
  });
});

// PUT request - update an existing user by ID
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { userGroup } = req.body;

  if (!userGroup) {
    return res.status(400).json({ error: "User group must be provided." });
  }

  const query = "UPDATE users SET userGroup = ? WHERE id = ?";
  connection.query(query, [userGroup, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database update error." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `User with ID '${id}' not found.` });
    }
    res.status(200).json({ id, userGroup });
  });
});

// PUT request - update an existing user group by ID
app.put("/api/userGroups/:id", (req, res) => {
  const { id } = req.params;
  const { userGroup } = req.body;

  if (!userGroup) {
    return res.status(400).json({ error: "User group must be provided." });
  }

  const query = "UPDATE usergroups SET name = ? WHERE id = ?";
  connection.query(query, [userGroup, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database update error." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `User group with ID '${id}' not found.` });
    }
    res.status(200).json({ id, name: userGroup });
  });
});

// DELETE request - remove a user by ID
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM users WHERE id = ?";
  connection.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database delete error." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `User with ID '${id}' not found.` });
    }
    return res.status(200).json({ message: `User with ID '${id}' successfully deleted.` });
  });
});

// DELETE request - remove a user group by ID
app.delete("/api/userGroups/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM usergroups WHERE id = ?";
  connection.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database delete error." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: `User group with ID '${id}' not found.` });
    }

    return res.status(200).json({ message: `User group with ID '${id}' successfully deleted.` });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
