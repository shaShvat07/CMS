const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
// const { verifyToken } = require('../middleware/verifyToken');

router.post("/register", register);
router.post("/login", login);
// router.get("/auth", verifyToken, auth);

module.exports = { authRoutes: router };