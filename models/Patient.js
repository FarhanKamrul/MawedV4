const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

class Patient {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 8);
    }

    authenticate(inputPassword) {
        return bcrypt.compare(inputPassword, this.password);
    }
}

const patientSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

patientSchema.loadClass(Patient);
const PatientModel = mongoose.model('Patient', patientSchema);

module.exports = PatientModel;
