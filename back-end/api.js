const express = require("express");
const router = express.Router();
const pool = require("./db");

router.post("/store-data", async (req, res) => {
  try {
    // Extract the API data from the request body
    const { currency, data } = req.body;
    console.log("Currency: ", currency, "\nData: ", data);

    // Store the data in the corresponding table
    const query = `INSERT INTO ${currency} (date, price, market_cap, total_volume, change_24h, change_7d, label) VALUES ($1, $2, $3, $4, $5, $6, $7)`;

    // Iterate through the data and execute the insert query for each item
    for (const item of data) {
      const {
        date,
        price,
        marketCap,
        totalVolume,
        change24h,
        change7d,
        label,
      } = item;
      console.log(
        date,
        price,
        marketCap,
        totalVolume,
        change24h,
        change7d,
        label
      );
      await pool.query(query, [
        date,
        price,
        marketCap,
        totalVolume,
        change24h,
        change7d,
        label,
      ]);
    }

    res.status(200).json({ message: "Data stored successfully" });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Failed to store data" });
  }
});

router.get("/", (req, res) => {
  res.send("Thesis Project (Miguel Remedios)");
});

module.exports = router;
