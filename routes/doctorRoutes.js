const express = require('express');
const router = express.Router();
const DoctorModel = require('../models/Doctor');
const DoctorController = require('../controllers/DoctorController');

const doctorController = new DoctorController(DoctorModel);

router.post('/', (req, res) => doctorController.addDoctor(req, res));
router.put('/:doctorId', (req, res) => doctorController.updateDoctor(req, res));
router.delete('/:doctorId', (req, res) => doctorController.deleteDoctor(req, res));

module.exports = router;
