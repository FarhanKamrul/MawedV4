class PatientController {
    constructor(patientModel) {
        this.Patient = patientModel;
    }

    async registerPatient(req, res) {
        try {
            const patient = new this.Patient(req.body);
            await patient.hashPassword();  // Assuming you handle password hashing inside the model or here
            await patient.save();
            res.status(201).json(patient);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Additional patient-specific methods like updating or deleting patient profiles
    async updatePatient(req, res) {
        try {
            const updatedPatient = await this.Patient.findByIdAndUpdate(
                req.params.patientId, 
                req.body, 
                { new: true }
            );
            res.json(updatedPatient);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = PatientController;
