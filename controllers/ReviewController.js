const AppointmentModel = require('../models/Appointment');  // Ensure this model is correctly imported

class ReviewController {
    constructor(reviewModel, appointmentModel, notificationService) {
        this.Review = reviewModel;
        this.Appointment = appointmentModel;
        this.NotificationService = notificationService;
    }

    async addReview(req, res) {
        try {
            const { doctorId, patientId, rating, comment } = req.body;
            const userId = req.user.id;  // Assuming this comes from decoded JWT token

            console.log('Inputs taken for review')
            // Check if the patient has completed an appointment with the doctor
            const appointment = await this.Appointment.findOne({
                patient: patientId,
                doctor: doctorId,
                status: 'Completed'
            });

            if (!appointment) {
                console.log('Appointment not found')
                return res.status(403).json({ message: "No completed appointments found with this doctor." });
            }

            // Validate patient and rating
            if (req.user.role !== 'patient' || userId !== patientId) {
                console.log('Unauthorized')
                return res.status(403).json({ message: "Only patients can leave reviews." });
            }

            if (typeof rating !== 'number' || rating < 1 || rating > 5) {
                console.log('Invalid rating')
                return res.status(400).json({ message: "Rating must be an integer between 1 and 5." });
            }

            console.log("Validated, adding review")

            const newReview = new this.Review({
                doctorId,
                patientId,
                rating: parseFloat(rating.toFixed(1)),
                comment
            });
            await newReview.save();
            res.status(201).json(newReview);
        } catch (error) {
            res.status(500).json({ message: "Failed to add review: " + error.message });
        }
    }

    async getReviewsByDoctor(req, res) {
        try {
            const doctorId = req.params.doctorId;
            const reviews = await this.Review.find({ doctor: doctorId });
            res.json(reviews);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = ReviewController;
