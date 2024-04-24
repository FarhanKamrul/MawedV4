const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
//require dotenv
require('dotenv').config();

// Import models
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');
const Review = require('./models/Review');


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(helmet());      // Helps secure Express apps by setting various HTTP headers
app.use(express.json()); // For parsing application/json



// MongoDB Connection
const dbURI = process.env.MONGO_URI// 



mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        //console.log('------------');
        console.log('MongoDB connected');
        // Uncomment the following line if you want to create sample data
        // createSampleData();
    })
    .catch(err => console.log('MongoDB connection error:', err));

// Example route
app.get('/', (req, res) => res.send('Hello World from Mawed Healthcare!'));

// Routes
const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);

const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);

const reviewRoutes = require('./routes/reviewRoutes');
app.use('/api/reviews', reviewRoutes);


// After all routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));


/*
// Sample data creation function
function createSampleData() {
    const samplePatient = new Patient({
        name: "John Doe",
        email: "john.doe@example.com",
        password: "password123" // Remember to hash passwords in a real application
    });

    const sampleDoctor = new Doctor({
        name: "Dr. Jane Smith",
        specialty: "Pediatrics",
        languages: ["English", "Spanish"]
    });

    samplePatient.save()
        .then(patient => {
            console.log('Sample patient created:', patient);
            sampleDoctor.save()
                .then(doctor => {
                    console.log('Sample doctor created:', doctor);
                    const sampleAppointment = new Appointment({
                        patient: patient._id,
                        doctor: doctor._id,
                        date: new Date()
                    });
                    sampleAppointment.save()
                        .then(appointment => {
                            console.log('Sample appointment created:', appointment);
                            const sampleReview = new Review({
                                doctor: doctor._id,
                                patient: patient._id,
                                rating: 5,
                                comment: "Excellent care!"
                            });
                            sampleReview.save()
                                .then(review => {
                                    console.log('Sample review created:', review);
                                });
                        });
                });
        })
        .catch(err => console.log('Error creating sample data:', err));
}
*/
