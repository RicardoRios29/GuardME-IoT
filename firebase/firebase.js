// Importar el SDK de Firebase
const firebase = require('firebase/app');
require('firebase/firestore'); // Importa Firestore si lo usas

// Configuración de Firebase
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

// Inicializar Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Obtener la instancia de Firestore
const db = firebase.firestore();

// Función para agregar un documento a Firestore
async function addDocument(collectionName, data) {
  try {
    const docRef = await db.collection(collectionName).add(data);
    console.log('Document written with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding document: ', error);
  }
}

// Función para obtener documentos de una colección
async function getDocuments(collectionName) {
  try {
    const snapshot = await db.collection(collectionName).get();
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return docs;
  } catch (error) {
    console.error('Error getting documents: ', error);
  }
}

// Exportar funciones para usar en otros archivos
module.exports = {
  addDocument,
  getDocuments
};
