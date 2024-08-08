import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js';
import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyA0pLcjHHprBiCmx7cil9jh7tVe2nP3bfY",
  authDomain: "guardme-94efc.firebaseapp.com",
  databaseURL: "https://guardme-94efc-default-rtdb.firebaseio.com",
  projectId: "guardme-94efc",
  storageBucket: "guardme-94efc.appspot.com",
  messagingSenderId: "628727852133",
  appId: "1:628727852133:web:4c8b54f9a51131211a6a8c",
  measurementId: "G-QK8J3PFQ4W"
};

let app;
let database;

export function initializeFirebase() {
  app = initializeApp(firebaseConfig);
  database = getDatabase(app);
}

export function updateGauges(gaugeHeartRate, gaugeSpo2) {
  const heartRateRef = ref(database, 'heartRate');
  const spo2Ref = ref(database, 'spo2');

  onValue(heartRateRef, (snapshot) => {
    const heartRate = snapshot.val();
    document.getElementById('heartRate').textContent = heartRate !== null ? heartRate : 'Paciente no detectado';
    gaugeHeartRate.refresh(heartRate !== null ? heartRate : 0);
  });

  onValue(spo2Ref, (snapshot) => {
    const spo2 = snapshot.val();
    document.getElementById('spo2').textContent = (spo2 !== null && spo2 !== -999) ? spo2 : 'Paciente no detectado';
    gaugeSpo2.refresh((spo2 !== null && spo2 !== -999) ? spo2 : 0);
  });
}