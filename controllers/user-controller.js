const nodemailer = require('nodemailer');
const User = require('../models/user-model').User;
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const Contact = require('../models/user-model').Contact;
const path = require('path');
const { createBot } = require("whatsapp-cloud-api");

// Configuración del transportador de correos
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false, // No se establece una conexión segura
    auth: {
        user: 'guardmeteam123@hotmail.com', // Tu dirección de correo electrónico de Outlook
        pass: 'guardme123',
    },
    tls: {
        rejectUnauthorized: false // Deshabilitar la verificación del certificado SSL
    }
});

async function createUser(req, res) {
    try {
        const { firstName, lastName, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const data = [firstName, lastName, email, hashedPassword];
        
        console.log(data);
        const user = User.createUser(data);
        if (user.error) {
            console.error("Query Error:", user.msg);
            res.status(500).send("Server Error");
        } else {
            console.log("Registration Successful!");
            res.sendStatus(200);
        }
    } catch (error) {
        console.error("Encryption Error:", error);
        res.status(500).send("Server Error");
    }
}

async function LocationPage(req, res) {
    try {
        const filePath = path.join(__dirname, '..', 'view', 'maps.html');
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error al enviar archivo:', error);
        res.status(500).send('Server Error');
    }
}

async function sendLocationByEmail(email, latitude, longitude) {
    try {
        let mailOptions = {
            from: 'guardmeteam123@hotmail.com',
            to: email,
            subject: 'GuardMe: Patient Location',
            text: `Greetings,\n\nSomeone has scanned your patient's QR code. Enter the following link to view the location on Google Maps:\n\nHere's the link: https://www.google.com/maps?q=${longitude},${latitude}\n\nBest wishes,\nGuardMe Team`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado:', info.response);
        return true;
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        return false;
    }
}

async function sendInfo(req, res) {
    try {
        const id = req.body.id;
        const longitude = req.body.latitud;
        const latitude = req.body.longitud;
        const contact = await Contact.getContactByPatientID(id);
        const email = contact[0].email;

        const success = await sendLocationByEmail(email, latitude, longitude);
        res.status(200).json({ success: success, message: 'Ubicación enviada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error });
    }
}

async function SendNoPatientDetectedEmail(email) {
    try {
        let mailOptions = {
            from: 'guardmeteam123@hotmail.com',
            to: 'rarm0399@gmail.com',
            subject: 'Alerta de Paciente No Detectado',
            text: 'Se ha detectado que el paciente no está siendo monitoreado correctamente. Por favor, revise el sistema.'
        };

        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico de alerta enviado con éxito.');
        return true;
    } catch (error) {
        console.error('Error al enviar el correo electrónico de alerta:', error);
        return false;
    }
}

const redirectToDownload = (req, res) => {
    try {
        const { name, id } = req.query;
        const filePath = path.join(__dirname, '..', 'main', 'qrDownload.html');
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error en el controlador de redirección:', error);
        res.status(500).send('Error en el servidor');
    }
};

module.exports = {
    createUser,
    sendInfo,
    LocationPage,
    redirectToDownload,
    SendNoPatientDetectedEmail
};
