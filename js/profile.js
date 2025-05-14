// Проверяем авторизацию при загрузке профиля
auth.onAuthStateChanged((user) => {
    const profileContent = document.getElementById('profile-content');
    const authForm = document.getElementById('auth-form');
    
    if (user) {
        // Показываем профиль для авторизованных
        profileContent.style.display = 'block';
        authForm.style.display = 'none';
        loadUserData(user.uid);
    } else {
        // Показываем форму входа для гостей
        profileContent.style.display = 'none';
        authForm.style.display = 'block';
    }
});

// Функция входа
window.login = async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
        alert('Ошибка входа: ' + error.message);
    }
};

    // Показываем досье
    authMessage.style.display = 'none';
    profileContent.style.display = 'block';

    // Загружаем данные
    const appDoc = await db.collection('applications').doc(user.uid).get();
    if (appDoc.exists) {
        const appData = appDoc.data();
        const regDate = appData.createdAt?.toDate() || new Date();
        
        // Заполняем данные
        document.getElementById('agent-callsign').textContent = appData.nickname || '[НЕ УКАЗАНО]';
        document.getElementById('agent-discord').textContent = appData.contact || '[НЕ УКАЗАНО]';
        document.getElementById('agent-regdate').textContent = regDate.toLocaleDateString();
        document.getElementById('agent-status').textContent = appData.status.toUpperCase();
        
        // Статус
        statusTag.textContent = `STATUS: ${appData.status.toUpperCase()}`;
        statusTag.className = `status-tag status-${appData.status}`;
        
        // Если одобрен
        if (appData.status === 'approved') {
            document.getElementById('approved-info').style.display = 'block';
        }
    }
});

// Функция входа в стиле терминала
function login() {
    const email = prompt("ВВЕДИТЕ ВАШ ID ДОСТУПА (EMAIL):");
    if (!email) return;
    
    const password = prompt("ВВЕДИТЕ КОД ДОСТУПА:");
    if (!password) return;
    
    auth.signInWithEmailAndPassword(email, password)
        .catch(error => {
            alert(`ОШИБКА ДОСТУПА: ${error.message}\nПовторите попытку или обратитесь в командование.`);
        });
}

