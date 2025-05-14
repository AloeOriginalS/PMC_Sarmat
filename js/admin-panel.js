let currentUser = null;

auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    if (!user) {
        window.location.href = "auth.html"; // Создайте страницу входа
        return;
    }

    try {
        const adminDoc = await db.collection('admins').doc(user.uid).get();
        if (!adminDoc.exists) {
            alert("Недостаточно прав доступа");
            await auth.signOut();
            window.location.href = "index.html";
            return;
        }
        loadApplications();
    } catch (error) {
        console.error("Ошибка проверки прав:", error);
        alert("Ошибка доступа: " + error.message);
    }
});

// Добавьте функцию выхода
function logout() {
    auth.signOut().then(() => {
        window.location.href = "index.html";
    });
}

async function loadApplications() {
    try {
        const snapshot = await db.collection('applications')
            .orderBy('createdAt', 'desc')
            .get();

        const list = document.getElementById('applicationsList');
        list.innerHTML = '';

        snapshot.forEach(doc => {
            const app = doc.data();
            const card = document.createElement('div');
            card.className = 'application-card';
            card.innerHTML = `
                <h3>${app.robloxNickname} <span class="status-${app.status}">(${app.status})</span></h3>
                <p>Email: ${app.email}</p>
                <p>Discord: ${app.discordNickname}</p>
                <p>Позывной: ${app.callsign}</p>
                <p>Возраст: ${app.age}</p>
                <p>${app.motivation}</p>
                <div class="application-actions">
                    <button onclick="approveApplication('${doc.id}')">✅ Одобрить</button>
                    <button onclick="rejectApplication('${doc.id}')">❌ Отклонить</button>
                </div>
            `;
            list.appendChild(card);
        });
    } catch (error) {
        console.error("Ошибка загрузки заявок:", error);
        alert("Ошибка загрузки заявок: " + error.message);
    }
}

async function approveApplication(id) {
    try {
        // Генерируем случайный пароль
        const tempPassword = generatePassword();

        // Получаем данные заявки
        const appDoc = await db.collection('applications').doc(id).get();
        const appData = appDoc.data();

        // Создаем пользователя в Firebase Auth
        const userCredential = await auth.createUserWithEmailAndPassword(appData.email, tempPassword);

        // Обновляем профиль пользователя (если нужно)
        await userCredential.user.updateProfile({
            displayName: appData.robloxNickname // Например, ник в Roblox
        });

        // Обновляем заявку в Firestore
        await db.collection('applications').doc(id).update({
            status: 'approved',
            reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
            tempPassword: tempPassword, // Сохраняем пароль (ВНИМАНИЕ: В РЕАЛЬНОМ ПРИЛОЖЕНИИ НУЖНО ХЕШИРОВАТЬ ПАРОЛЬ!)
            userId: userCredential.user.uid // Сохраняем ID пользователя
        });

        alert("Заявка одобрена! Пароль отправлен на почту.");
        loadApplications();
    } catch (error) {
        console.error("Ошибка одобрения заявки:", error);
        alert("Ошибка одобрения заявки: " + error.message);
    }
}

async function rejectApplication(id) {
    try {
        await db.collection('applications').doc(id).update({
            status: 'rejected',
            reviewedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert("Заявка отклонена!");
        loadApplications();
    } catch (error) {
        console.error("Ошибка отклонения заявки:", error);
        alert("Ошибка отклонения заявки: " + error.message);
    }
}

function generatePassword() {
    const length = 12;
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
}
