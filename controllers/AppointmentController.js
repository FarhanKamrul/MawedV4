class AppointmentController {
    constructor(appointmentModel) {
        this.Appointment = appointmentModel;
    }

    async bookAppointment(req, res) {
        try {
            const newAppointment = new this.Appointment(req.body);
            await newAppointment.save();
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
            res.json(updatedAppointment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async cancelAppointment(req, res) {
        try {
            await this.Appointment.findByIdAndUpdate(
                req.params.appointmentId, 
                { status: 'cancelled' }
            );
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = AppointmentController;
