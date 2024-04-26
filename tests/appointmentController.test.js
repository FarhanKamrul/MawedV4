const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Import mongoose to use ObjectId
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
// Setting up routes for updating, cancelling, and completing appointments
app.post('/appointments/update/:appointmentId', (req, res) => appointmentController.updateAppointment(req, res));
app.post('/appointments/cancel/:appointmentId', (req, res) => appointmentController.cancelAppointment(req, res));
app.post('/appointments/complete/:appointmentId', (req, res) => appointmentController.appointmentCompleted(req, res));


describe('AppointmentController', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        AppointmentModel.mockClear();
        NotificationService.mockClear();
    });

    it('should book an appointment successfully', async () => {
        const patientId = new mongoose.Types.ObjectId().toHexString(); 
        const doctorId = new mongoose.Types.ObjectId().toHexString(); 

        console.log("Type of PatientId and DoctorID:", typeof patientId, typeof doctorId);

        // Mocking findOne to ensure no appointment is found at the given slot
        AppointmentModel.findOne = jest.fn().mockResolvedValue(null);

        // Mocking save to simulate successful appointment booking
        const mockAppointment = { save: jest.fn().mockResolvedValue(true) };
        AppointmentModel.mockImplementation(() => mockAppointment);
        
        const response = await request(app)
            .post('/appointments/book')
            .send({ patientId: patientId, doctorId: doctorId, date: new Date() });

        expect(response.statusCode).toBe(201);
        expect(mockAppointment.save).toHaveBeenCalledTimes(1);
    });

    it('should return 409 if the time slot is already booked', async () => {
        const patientId = new mongoose.Types.ObjectId().toHexString();
        const doctorId = new mongoose.Types.ObjectId().toHexString();

        // Simulate found appointment to trigger 409 conflict
        AppointmentModel.findOne = jest.fn().mockResolvedValue(true);
        
        const response = await request(app)
            .post('/appointments/book')
            .send({ patientId: patientId, doctorId: doctorId, date: new Date() });

        expect(response.statusCode).toBe(409);
        expect(AppointmentModel.findOne).toHaveBeenCalledTimes(1);
    });
    it('should update an appointment successfully', async () => {
        const appointmentId = new mongoose.Types.ObjectId().toHexString();
        const updateData = { status: 'rescheduled' };

        // Mocking findByIdAndUpdate to simulate successful update
        AppointmentModel.findByIdAndUpdate = jest.fn().mockResolvedValue({
            _id: appointmentId,
            ...updateData
        });

        const response = await request(app)
            .post(`/appointments/update/${appointmentId}`)
            .send(updateData);

        expect(response.statusCode).toBe(200);
        expect(AppointmentModel.findByIdAndUpdate).toHaveBeenCalledWith(
            appointmentId,
            updateData,
            { new: true }
        );
        expect(response.body.status).toBe('rescheduled');
    });

    it('should cancel an appointment successfully', async () => {
        const appointmentId = new mongoose.Types.ObjectId().toHexString();

        // Mock to simulate appointment finding
        AppointmentModel.findById = jest.fn().mockResolvedValue({
            _id: appointmentId,
            status: 'scheduled',
            save: jest.fn().mockResolvedValue({
                _id: appointmentId,
                status: 'cancelled'
            })
        });

        const response = await request(app)
            .post(`/appointments/cancel/${appointmentId}`);

        expect(response.statusCode).toBe(204);
        expect(AppointmentModel.findById).toHaveBeenCalledWith(appointmentId);
        expect(response.body).toEqual({});
    });

    it('should complete an appointment successfully', async () => {
        const appointmentId = new mongoose.Types.ObjectId().toHexString();

        // Mock to simulate finding and saving an appointment
        AppointmentModel.findById = jest.fn().mockResolvedValue({
            _id: appointmentId,
            status: 'scheduled',
            save: jest.fn().mockResolvedValue({
                _id: appointmentId,
                status: 'completed'
            })
        });

        const response = await request(app)
            .post(`/appointments/complete/${appointmentId}`);

        expect(response.statusCode).toBe(204);
        expect(AppointmentModel.findById).toHaveBeenCalledWith(appointmentId);
        expect(response.body).toEqual({});
    });
});
