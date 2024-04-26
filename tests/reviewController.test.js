const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../models/Review');
jest.mock('../models/Appointment');
const ReviewModel = require('../models/Review');
const AppointmentModel = require('../models/Appointment');
const ReviewController = require('../controllers/ReviewController');
const NotificationService = require('../services/NotificationService');
const reviewRoutes = require('../routes/reviewRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api', reviewRoutes); // Assuming your routes file is named reviewRoutes

describe('ReviewController', () => {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        ReviewModel.mockClear();
        AppointmentModel.mockClear();

        // Simulate the user as part of the request
        app.use((req, res, next) => {
            req.user = { id: 'patient123', role: 'patient' };  // Adjust ID and role as necessary
            next();
        });

        // Then apply review routes
        app.use('/api', reviewRoutes)
    });

    it('should add a review successfully if the appointment was completed', async () => {
        AppointmentModel.findOne = jest.fn().mockResolvedValue(true); // Simulate found completed appointment

        const mockReview = { save: jest.fn().mockResolvedValue(true) };
        ReviewModel.mockImplementation(() => mockReview);

        const response = await request(app)
            .post('/api/reviews')
            .send({
                doctorId: 'doctor123',
                patientId: 'patient123',
                rating: 5,
                comment: 'Great doctor!'
            });

        expect(response.statusCode).toBe(201);
        expect(ReviewModel.mock.calls.length).toBe(1);  // Ensuring the save method is called
    });

    it('should not add a review if no completed appointment exists', async () => {
        AppointmentModel.findOne = jest.fn().mockResolvedValue(null); // No completed appointment

        const response = await request(app)
            .post('/api/reviews')
            .send({
                doctorId: 'doctor123',
                patientId: 'patient123',
                rating: 5,
                comment: 'Great doctor!'
            });

        expect(response.statusCode).toBe(403);
    });

    it('should retrieve reviews for a doctor', async () => {
        ReviewModel.find = jest.fn().mockResolvedValue([{ comment: 'Good job' }]);

        const response = await request(app)
            .get('/api/reviews/doctor/doctor123');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([{ comment: 'Good job' }]));
    });
});
