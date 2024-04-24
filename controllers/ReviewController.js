class ReviewController {
    constructor(reviewModel) {
        this.Review = reviewModel;
    }

    async addReview(req, res) {
        try {
            const newReview = new this.Review(req.body);
            await newReview.save();
            res.status(201).json(newReview);
        } catch (error) {
            res.status(500).json({ message: error.message });
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
