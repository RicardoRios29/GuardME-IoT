const express = require("express");
const router = express.Router();
const userController = require('../controllers/user-controller');
const path = require('path');

// Route for user registration
router.post("/registerUser", userController.createUser);

// Route for service page with ID
router.get('/service/:id', userController.LocationPage);

// Route for sending information
router.post('/service/sendInfo', userController.sendInfo);

// Route for downloading
router.get('/download', userController.redirectToDownload);

// Route for serving firebase.html
router.get('/firebase', (req, res) => {
  res.sendFile(path.join(__dirname, '../firebase/firebase.js'));
});

// Route for testing sending an alert
router.get('/test-send-alert', async (req, res) => {
  try {
    const success = await userController.SendNoPatientDetectedEmail('rarm0399@gmail.com');
    if (success) {
      res.status(200).json({ success: true, message: 'Alerta de paciente no detectado enviada con éxito' });
    } else {
      res.status(500).json({ success: false, message: 'Error al enviar la alerta' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Route for notifying patient not detected
router.post('/notify-patient-not-detected', async (req, res) => {
  const { message } = req.body;

  try {
    // Call your function to handle notification, e.g., sending an email
    const success = await userController.SendNoPatientDetectedEmail('rarm0399@gmail.com'); // Correo para la prueba
    if (success) {
      res.status(200).json({ success: true, message: 'Notificación enviada' });
    } else {
      res.status(500).json({ success: false, message: 'Error al enviar la notificación' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
