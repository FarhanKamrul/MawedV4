const express = require('express');
const router = express.Router();
const AppointmentModel = require('../models/Appointment');
const AppointmentController = require('../controllers/AppointmentController');
const NotificationService = require('../services/NotificationService');

const appointmentController = new AppointmentController(AppointmentModel, NotificationService);

router.post('/', (req, res) => appointmentController.bookAppointment(req, res));
router.put('/:appointmentId', (req, res) => appointmentController.updateAppointment(req, res));
router.put('/cancel/:appointmentId', (req, res) => appointmentController.cancelAppointment(req, res));

module.exports = router;
