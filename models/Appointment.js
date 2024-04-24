const mongoose = require('mongoose');

class Appointment {
    constructor(patient, doctor, date, status) {
        this.patient = patient;
        this.doctor = doctor;
        this.date = date;
        this.status = status; // e.g., scheduled, cancelled
    }
}

const appointmentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    status: { type: String, default: 'scheduled' }
});

appointmentSchema.loadClass(Appointment);
const AppointmentModel = mongoose.model('Appointment', appointmentSchema);

module.exports = AppointmentModel;
