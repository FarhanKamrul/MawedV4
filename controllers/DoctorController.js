class DoctorController {
    constructor(doctorModel) {
        this.Doctor = doctorModel;
    }

    async addDoctor(req, res) {
        try {
            const doctor = new this.Doctor(req.body);
            await doctor.save();
            res.status(201).json(doctor);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateDoctor(req, res) {
        try {
            const updatedDoctor = await this.Doctor.findByIdAndUpdate(req.params.doctorId, req.body, { new: true });
            res.json(updatedDoctor);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteDoctor(req, res) {
        try {
            await this.Doctor.findByIdAndDelete(req.params.doctorId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = DoctorController;
