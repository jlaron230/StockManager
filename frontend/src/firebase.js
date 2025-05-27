import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

console.log("📲 FCM init");

const firebaseConfig = {
    apiKey: "AIzaSyBmiHJ1YYf2xrNpbvHtA7g-dyXIV-QRSSU",
    authDomain: "gestock-7d3d3.firebaseapp.com",
    projectId: "gestock-7d3d3",
    storageBucket: "gestock-7d3d3.firebasestorage.app",
    messagingSenderId: "61514745913",
    appId: "1:61514745913:web:f654af633ff69af9bae5e8"
  };


const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export { messaging, getToken, onMessage };
