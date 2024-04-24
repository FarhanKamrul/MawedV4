const express = require('express');
const router = express.Router();
const PatientModel = require('../models/Patient'); // or PatientModel if you use the same model for login
const AuthController = require('../controllers/AuthController');

const authController = new AuthController(PatientModel);

router.post('/login', (req, res) => authController.loginUser(req, res));

module.exports = router;
