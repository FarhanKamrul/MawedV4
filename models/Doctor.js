const mongoose = require('mongoose');

class Doctor {
    constructor(name, specialty, languages) {
        this.name = name;
        this.specialty = specialty;
        this.languages = languages;
    }
}

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    languages: [String]
});

doctorSchema.loadClass(Doctor);
const DoctorModel = mongoose.model('Doctor', doctorSchema);

module.exports = DoctorModel;
