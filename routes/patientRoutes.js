const express = require('express');
const router = express.Router();
const PatientModel = require('../models/Patient');
const PatientController = require('../controllers/PatientController');

const patientController = new PatientController(PatientModel);

router.post('/register', (req, res) => patientController.registerPatient(req, res));
router.post('/login', (req, res) => patientController.loginPatient(req, res));

module.exports = router;
