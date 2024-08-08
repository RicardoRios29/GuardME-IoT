const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    patient_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    first_name: String,
    last_name: String,
    phone_num: String,
    email: String,
    created_at: { type: Date, default: Date.now },
    active: { type: Boolean, default: true }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = { Contact };
