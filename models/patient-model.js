const mongoose = require('mongoose');

// Definir el esquema del contacto
const contactSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    phone_num: String,
    email: String,
    created_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: true }
});

// Definir el esquema del paciente
const patientSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    gender: String,
    birth_date: Date,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: true },
    contacts: [contactSchema]
}, { collection: 'Patients' });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = { Patient };
