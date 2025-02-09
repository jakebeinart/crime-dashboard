// import { parseISO } from "date-fns";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

var express = require("express");
var router = express.Router();

// Function to open the database

async function openDb() {
  return open({
    filename: "../data/database.db",

    driver: sqlite3.Database,
  });
}

// API endpoint to query data from the SQLite database

router.get("/", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ error: "Missing startDate or endDate query parameter" });
  }

  try {
    // Parse the dates
    // const parsedStartDate = parseISO(startDate);
    // const parsedEndDate = parseISO(endDate);
    const parsedStartDate = Date.parse(startDate);
    const parsedEndDate = Date.parse(endDate);

    // Open the database
    const db = await openDb();

    // Query the database
    const query = `
      SELECT * FROM STLPD
      WHERE IncidentDate >= ? AND IncidentDate <= ?
    `;

    const rows = await db.all(
      query,
      parsedStartDate.toISOString(),
      parsedEndDate.toISOString()
    );

    // Close the database
    await db.close();
    // Return the results

    res.json(rows);
  } catch (error) {
    console.error(error);

    res
      .status(500)
      .json({ error: "An error occurred while querying the database" });
  }
});

/* GET users listing. */
// router.get("/", function (req, res, next) {
//   res.send("respond with a resource");
// });

module.exports = router;
