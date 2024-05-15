const bcrypt = require("bcrypt");
const { pool } = require('../config/dbConfig');
const jwt = require('jsonwebtoken');

//Register
async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    // Check if the email already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      // If the email already exists, return an error
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
}

//Login
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: "Email not found!" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign({ user: user }, process.env.SECRET_KEY, {
      expiresIn: "10h"
    });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(400).send("SERVER ERROR");
  }
}

//auth to check if the token is expired or not 
// async function auth(req, res) {
//   try {
//     const user_id = req.data.user.user_id;
//     if (user_id) {
//       res.json("ok");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(401).send("Unauthorized");
//   }
// }

module.exports = { register, login };