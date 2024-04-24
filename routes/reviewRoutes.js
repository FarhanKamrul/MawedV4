const express = require('express');
const router = express.Router();
const ReviewModel = require('../models/Review');
const ReviewController = require('../controllers/ReviewController');

const reviewController = new ReviewController(ReviewModel);

router.post('/', (req, res) => reviewController.addReview(req, res));
router.get('/doctor/:doctorId', (req, res) => reviewController.getReviewsByDoctor(req, res));

module.exports = router;
