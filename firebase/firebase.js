// Importar el SDK de Firebase
const firebase = require('firebase/app');
require('firebase/database');  // Importa Realtime Database

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Inicializar Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Obtener la instancia de la base de datos en tiempo real
const database = firebase.database();

// Función para actualizar los medidores en tiempo real
function updateGauges(gaugeHeartRate, gaugeSpo2) {
  const heartRateRef = database.ref('heartRate');
  const spo2Ref = database.ref('spo2');

  heartRateRef.on('value', (snapshot) => {
    const heartRate = snapshot.val();
    document.getElementById('heartRate').textContent = heartRate !== null ? heartRate : 'No disponible';
    gaugeHeartRate.refresh(heartRate !== null ? heartRate : 0);
  });

  spo2Ref.on('value', (snapshot) => {
    const spo2 = snapshot.val();
    document.getElementById('spo2').textContent = spo2 !== null ? spo2 : 'No disponible';
    gaugeSpo2.refresh(spo2 !== null ? spo2 : 0);
  });
}

// Exportar la función para usarla en el archivo HTML
module.exports = {
  updateGauges
};

