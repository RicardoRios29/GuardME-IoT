const express = require("express");
const app = express();
const PORT = 3000;
const mysql = require("mysql");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const { createBot } = require("whatsapp-cloud-api");
require("dotenv").config();
const userController = require('./controllers/user-controller');
const generateAndSaveQRCode = require('./tools/qrFunctions');
const indexRouter = require('./routes/index');

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "rarm",
  database: "guardme",
});

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  } else {
    return res.sendStatus(401); // Unauthorized
  }
};

// Serve static files
app.use(express.static(__dirname));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use indexRouter for routing
app.use('/', indexRouter);

// Define routes
app.get("/contacts", isAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/contacts/contacts.html");
});

app.get("/home", isAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/home/home.html");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/main/main.html");
});

app.get("/register", isAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/register/register.html");
});

app.get("/session", (req, res) => {
  if (req.session && req.session.userId) {
    // The user is authenticated
    res.json({ isAuthenticated: true });
  } else {
    // The user is not authenticated
    res.json({ isAuthenticated: false });
  }
});

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Obtains hash from database to authenticate password
    const query = "SELECT id_user, password FROM users WHERE email = ?";
    connection.query(query, [email], async (error, results) => {
      if (error) {
        console.error("Query Error:", error);
        res.status(500).send("Server Error");
      } else {
        if (results.length > 0) {
          const hashedPassword = results[0].password;

          // Compares user's password with the one stored
          const match = await bcrypt.compare(password, hashedPassword);

          if (match) {
            console.log("Successful Login!");
            res.sendStatus(200);
          } else {
            console.error("Incorrect Password");
            res.status(401).send('Incorrect Password');
          }
        } else {
          console.error("Incorrect Credentials");
          res.status(401).send("Incorrect Credentials");
        }
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send("Server Error");
  }
});

// Handle patient and contact registration
app.post('/ContPatRegister', async (req, res) => {
  const { patient, contact } = req.body;

  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    let PatientId = 0;

    const patientQuery = 
      'INSERT INTO patients (first_name, last_name, gender, link, birth_date, created_at, active) VALUES (?, ?, ?, NULL, ?, NOW(), 1)';
    connection.query(
      patientQuery,
      [patient.firstName, patient.lastName, patient.gender, patient.birthDate],
      (error, patientResults) => {
        if (error) {
          console.error('Patient Registration Error:', error);
          res.status(500).send('Server Error');
        } else {
          PatientId = patientResults.insertId;
          const contactQuery =
            'INSERT INTO contacts (patient_id, first_name, last_name, phone_num, email, created_at, active) VALUES (?, ?, ?, ?, ?, NOW(), 1)';
          connection.query(
            contactQuery,
            [PatientId, contact.firstName, contact.lastName, contact.phoneNum, contact.email],
            (error, contactResults) => {
              if (error) {
                console.error('Contact Registration Error:', error);
              } else {
                const link = `${baseUrl}/service/${contactResults.insertId}`;
                generateAndSaveQRCode(link, `./QR/${contact.firstName}-${contactResults.insertId}.png`);
                const linkQuery = 'UPDATE patients SET link = ? WHERE id_patient = ?';
                connection.query(
                  linkQuery,
                  [link, PatientId],
                  (error) => {
                    if (error) {
                      console.error('Link Update Error:', error);
                      res.status(500).send('Server Error');
                    } else {
                      console.log('Link Update Successful!');
                      res.status(200).json({ success: true, name: contact.firstName, id: contactResults.insertId });
                    }
                  }
                );
                console.log('User Registration Successful!');
              }
            }
          );
        }
      }
    );
  } catch (error) {
    console.error('User Registration Error:', error);
    res.status(500).send('Server Error');
  }
});

// Start server
app.listen(PORT, () => {
  console.log("server running on port", PORT);
});
