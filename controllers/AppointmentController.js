const mongoose = require('mongoose');
const NotificationService = require('../services/NotificationService');

class AppointmentController {
    constructor(appointmentModel, userModel, notificationService) {
        this.Appointment = appointmentModel;
        this.User = userModel;
        this.NotificationService = notificationService;
    }

    _ensureObjectId(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Invalid MongoDB ObjectId');
        }
        return new mongoose.Types.ObjectId(id);
    }

    async bookAppointment(req, res) {
        try {
            let { patientId, doctorId, date } = req.body;

            // Ensure ObjectId conversion
            patientId = this._ensureObjectId(patientId);
            doctorId = this._ensureObjectId(doctorId);

            const existingAppointment = await this.Appointment.findOne({ doctorId, date });
            if (existingAppointment) {
                return res.status(409).json({ message: "This time slot is already booked." });
            }

            const newAppointment = new this.Appointment({ patientId, doctorId, date, status: 'scheduled' });
            await newAppointment.save();

            /*
            try {
                const patientMessage = "Your appointment has been booked.";
                const doctorMessage = "A new appointment has been scheduled.";
                await this.NotificationService.addNotification(patientId, patientMessage);
                await this.NotificationService.addNotification(doctorId, doctorMessage);
            } catch (error) {
                console.error('Booking notification not sent:', error);
            }
            */

            res.status(201).json(newAppointment);
        } catch (error) {
            console.error('Error booking appointment:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async updateAppointment(req, res) {
        try {
            const updatedAppointment = await this.Appointment.findByIdAndUpdate(
                req.params.appointmentId,
                req.body,
                { new: true }
            );
            res.json(updatedAppointment);
        } catch (error) {
            console.error('Error updating appointment:', error);
            res.status(500).json({ message: error.message });
        }
    }

    async cancelAppointment(req, res) {
        try {
            const appointment = await this.Appointment.findById(req.params.appointmentId);
            if (!appointment) {
                return res.status(404).json({ message: "Appointment not found." });
            }
            appointment.status = 'cancelled';
            await appointment.save();

            /*
            try {
                await this.NotificationService.addNotification(appointment.patientId, "Your appointment has been cancelled.");
                await this.NotificationService.addNotification(appointment.doctorId, "An appointment has been cancelled.");
            }
            catch (error) {
                console.error('Cancellation notification not sent:', error);
            }
            */
            
            res.status(204).send();
        } catch (error) {
            console.log('Error cancelling appointment:', error.message)
            res.status(500).json({ message: error.message });
        }
    }

    async appointmentCompleted(req, res) {
        try {
            const appointment = await this.Appointment.findOne({
                patient: patientId,
                doctor: doctorId,
                status: 'Completed'
            });
            if (!appointment) {
                return res.status(404).json({ message: "Appointment not found." });
            }
            appointment.status = 'completed';
            await appointment.save();
            
            /*
            try {
                await this.NotificationService.addNotification(appointment.patientId, "Your appointment has been completed.");
                await this.NotificationService.addNotification(appointment.doctorId, "An appointment has been completed.");
            }
            catch (error) {
                console.error('Completion notification not sent:', error);
            }
            */
            res.status(204).send();
        } catch (error) {
            console.log('Error completing appointment:', error.message)
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = AppointmentController;
