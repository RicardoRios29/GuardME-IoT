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

module.exports = router;
