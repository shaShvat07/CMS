const pg = require("pg");
const dotenv = require('dotenv');

dotenv.config();

const pool = new pg.Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

pool.connect((err) => {
  if(err) throw err;
  console.log("Connected to PostgreSQL successfully!");
});

module.exports = { pool };