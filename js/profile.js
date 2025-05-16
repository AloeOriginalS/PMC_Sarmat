import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, updatePassword } from "firebase/auth";

// Элементы DOM
const loginForm = document.getElementById('loginForm');
const profileContent = document.getElementById('profileContent');
const userEmail = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');
const changePasswordBtn = document.getElementById('changePasswordBtn');

// Вход
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert('Вход выполнен!');
    toggleAuthUI(true);
    userEmail.textContent = email;
  } catch (error) {
    alert('Ошибка: ' + error.message);
  }
});

// Выход
logoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  toggleAuthUI(false);
});

// Смена пароля
changePasswordBtn.addEventListener('click', async () => {
  const newPassword = prompt('Введите новый пароль:');
  if (newPassword) {
    await updatePassword(auth.currentUser, newPassword);
    alert('Пароль изменён!');
  }
});

// Переключение между формами
function toggleAuthUI(isLoggedIn) {
  loginForm.style.display = isLoggedIn ? 'none' : 'block';
  profileContent.style.display = isLoggedIn ? 'block' : 'none';
}

// Проверка авторизации при загрузке
auth.onAuthStateChanged(user => {
  if (user) {
    toggleAuthUI(true);
    userEmail.textContent = user.email;
  } else {
    toggleAuthUI(false);
  }
});