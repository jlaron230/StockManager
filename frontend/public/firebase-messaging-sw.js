// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBmiHJ1YYf2xrNpbvHtA7g-dyXIV-QRSSU",
  projectId: "yougestock-7d3d3r-app",
  messagingSenderId: "61514745913",
  appId: "1:61514745913:web:f654af633ff69af9bae5e8",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("📩 Message reçu en arrière-plan :", payload);
});
