const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const AppointmentController = require('../controllers/AppointmentController');
const AppointmentModel = require('../models/Appointment'); // Mock this
const NotificationService = require('../services/NotificationService'); // Mock this

jest.mock('../models/Appointment');
jest.mock('../services/NotificationService');

const app = express();
app.use(bodyParser.json());

const notificationService = new NotificationService();
const appointmentController = new AppointmentController(AppointmentModel, notificationService);
app.post('/appointments/book', (req, res) => appointmentController.bookAppointment(req, res));

describe('AppointmentController', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        AppointmentModel.mockClear();
        NotificationService.mockClear();
    });

    it('should book an appointment successfully', async () => {
        // Mocking findOne to ensure no appointment is found at the given slot
        AppointmentModel.findOne = jest.fn().mockResolvedValue(null);

        // Mocking save to simulate successful appointment booking
        const mockAppointment = { save: jest.fn().mockResolvedValue(true) };
        AppointmentModel.mockImplementation(() => mockAppointment);
        
        const response = await request(app)
            .post('/appointments/book')
            .send({ patientId: '123', doctorId: '456', date: new Date() });

        expect(response.statusCode).toBe(201);
        expect(mockAppointment.save).toHaveBeenCalledTimes(1);
    });

    it('should return 409 if the time slot is already booked', async () => {
        // Simulate found appointment to trigger 409 conflict
        AppointmentModel.findOne = jest.fn().mockResolvedValue(true);
        
        const response = await request(app)
            .post('/appointments/book')
            .send({ patientId: '123', doctorId: '456', date: new Date() });

        expect(response.statusCode).toBe(409);
        expect(AppointmentModel.findOne).toHaveBeenCalledTimes(1);
    });
});
