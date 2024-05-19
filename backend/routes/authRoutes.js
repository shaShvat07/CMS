const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/verifyToken');
const userController = require('../controllers/userController');

router.post("/register", register);
router.post("/login", login);
router.get("/user", verifyToken, userController.getUserById);


module.exports = { authRoutes: router };