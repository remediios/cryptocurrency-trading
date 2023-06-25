const express = require("express");
const dataRouter = require("./api");
const cors = require("cors");

const app = express();
const port = 4000;

app.use(express.json({ limit: "20mb" }));

app.use(cors()); // Enable CORS

// Mount the data router under a specific base URL
app.use("/api/data", dataRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
