// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyBJ6VkW6Kru9xLnyN8G1EvS4gKESEoHH68",
    authDomain: "authentication-cf670.firebaseapp.com",
    projectId: "authentication-cf670",
    storageBucket: "authentication-cf670.firebasestorage.app",
    messagingSenderId: "135324689233",
    appId: "1:135324689233:web:e0956a8ee78ca5aeff2970",
	measurementId: "G-VXJY0F36N1"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();