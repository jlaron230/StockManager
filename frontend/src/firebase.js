// Importation des fonctions nécessaires depuis Firebase
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Message de confirmation dans la console
console.log("📲 FCM init");

// Configuration Firebase (copiée depuis ton projet Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyBmiHJ1YYf2xrNpbvHtA7g-dyXIV-QRSSU", // Clé API
    authDomain: "gestock-7d3d3.firebaseapp.com", // Domaine d'authentification
    projectId: "gestock-7d3d3", // ID du projet
    storageBucket: "gestock-7d3d3.firebasestorage.app", // Stockage
    messagingSenderId: "61514745913", // ID de l'expéditeur FCM
    appId: "1:61514745913:web:f654af633ff69af9bae5e8" // ID de l'app
};

// Initialisation de l'application Firebase avec la configuration
const firebaseApp = initializeApp(firebaseConfig);

// Initialisation de la messagerie Firebase
const messaging = getMessaging(firebaseApp);

// Exportation des outils de messagerie
export { messaging, getToken, onMessage };
