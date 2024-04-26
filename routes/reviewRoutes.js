const express = require('express');
const ReviewController = require('../controllers/ReviewController');
const ReviewModel = require('../models/Review');
const AppointmentModel = require('../models/Appointment');
const NotificationService = require('../services/NotificationService');

// Instantiate your controller with dependencies
const reviewController = new ReviewController(ReviewModel, AppointmentModel, new NotificationService());

const router = express.Router();

// Middleware to authenticate and set req.user (simulate this in tests or implement actual authentication)
router.use((req, res, next) => {
    req.user = { id: 'authenticatedUserId', role: 'patient' }; // Simulated user object
    next();
});

// Route to add a review
router.post('/reviews', (req, res) => reviewController.addReview(req, res));

// Route to get reviews by doctor
router.get('/reviews/doctor/:doctorId', (req, res) => reviewController.getReviewsByDoctor(req, res));

module.exports = router;
