const Pool = require("pg").Pool;

const dbConfig = {
  host: "localhost", // Hostname or IP address of the PostgreSQL server
  port: 5433, // Port number of the PostgreSQL server
  database: "thesis", // Name of the PostgreSQL database
  user: "postgres", // Username for the database connection
  password: "admin", // Password for the database connection
};

const pool = new Pool(dbConfig);

module.exports = pool;
