const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();
const port = 3000;

// Path to the existing SQLite database
const dbPath = path.resolve(__dirname, "../data/database.db");

// Connect to the SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the SQLite database at", dbPath);
  }
});

// Enable CORS for all routes
app.use(cors());

// Endpoint that takes an SQL query as a query parameter and executes it
app.get("/execute-sql", (req, res) => {
  const sql = req.query.sql;

  if (!sql) {
    return res.status(400).send("SQL query is required as a query parameter");
  }

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Error executing SQL query:", err.message);
      return res.status(500).send("Error executing SQL query");
    }

    res.json(rows);
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Gracefully close the database connection when the application is terminated
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing the database connection:", err.message);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(0);
  });
});
