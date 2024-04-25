const NotificationService = require('../services/NotificationService');
const notificationService = new NotificationService();


class AppointmentController {
    constructor(appointmentModel, userModel, notificationService) {
        this.Appointment = appointmentModel;
        this.User = userModel;
        this.NotificationService = notificationService;
    }

    async bookAppointment(req, res) {
        try {
            const { patientId, doctorId, date } = req.body;

            // Check if the slot is available
            const existingAppointment = await this.Appointment.findOne({ doctorId, date });
            if (existingAppointment) {
                return res.status(409).json({ message: "This time slot is already booked." });
            }

            // Create the appointment
            const newAppointment = new this.Appointment({ patientId, doctorId, date, status: 'scheduled' });
            await newAppointment.save();

            // Send notifications to the patient and doctor
            this.NotificationService.addNotification(patientId, "Your appointment has been booked.");
            this.NotificationService.addNotification(doctorId, "A new appointment has been scheduled.");

            res.status(201).json(newAppointment);
        } catch (error) {
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
            // Consider adding notification logic here as well if relevant
            res.json(updatedAppointment);
        } catch (error) {
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

            // Send cancellation notifications
            this.NotificationService.addNotification(appointment.patientId, "Your appointment has been cancelled.");
            this.NotificationService.addNotification(appointment.doctorId, "An appointment has been cancelled.");

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = AppointmentController;
