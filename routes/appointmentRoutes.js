const express = require('express');
const router = express.Router();
const AppointmentModel = require('../models/Appointment');
const AppointmentController = require('../controllers/AppointmentController');

const appointmentController = new AppointmentController(AppointmentModel);

router.post('/', (req, res) => appointmentController.bookAppointment(req, res));
router.put('/:appointmentId', (req, res) => appointmentController.updateAppointment(req, res));
router.put('/cancel/:appointmentId', (req, res) => appointmentController.cancelAppointment(req, res));

module.exports = router;
