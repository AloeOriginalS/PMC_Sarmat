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

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "ваш_email@gmail.com", pass: "пароль_приложения" },
});

exports.sendApprovalEmail = functions.firestore
  .document("applications/{appId}")
  .onUpdate(async (change, context) => {
    const newData = change.after.data();
    const prevData = change.before.data();

    if (newData.status === "approved" && prevData.status !== "approved") {
      const password = generateRandomPassword(); // Реализуй эту функцию

      // Создаем пользователя в Firebase Auth
      await admin.auth().createUser({ email: newData.email, password });

      // Отправляем письмо
      await transporter.sendMail({
        from: '"ЧВК Сармат" <noreply@sarmat.com>',
        to: newData.email,
        subject: "Ваша заявка одобрена!",
        text: `Логин: ${newData.email}\nПароль: ${password}`,
      });
    }
  });