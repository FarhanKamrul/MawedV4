const mongoose = require('mongoose');

class Review {
    constructor(doctor, patient, rating, comment) {
        this.doctor = doctor;
        this.patient = patient;
        this.rating = rating;
        this.comment = comment;
    }
}

const reviewSchema = new mongoose.Schema({
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true }
});

reviewSchema.loadClass(Review);
const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;
