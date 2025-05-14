document.getElementById('applicationForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const robloxNickname = document.getElementById('robloxNickname').value;
    const discordNickname = document.getElementById('discordNickname').value;
    const callsign = document.getElementById('callsign').value;
    const age = document.getElementById('age').value;
    const motivation = document.getElementById('motivation').value;

    // Простая валидация
    if (!email || !robloxNickname || !discordNickname || !callsign || !age || !motivation) {
        alert('Пожалуйста, заполните все поля.');
        return;
    }

    try {
        // Получаем текущего пользователя (если он авторизован)
        const user = firebase.auth().currentUser;
        let userId = null;
        if (user) {
            userId = user.uid;
        }

        // Сохраняем заявку в Firestore
        await db.collection('applications').add({
            email: email,
            robloxNickname: robloxNickname,
            discordNickname: discordNickname,
            callsign: callsign,
            age: parseInt(age),
            motivation: motivation,
            status: 'pending',
            userId: userId, // Сохраняем ID пользователя
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert('Заявка отправлена! Ожидайте письма с данными для входа.');
        document.getElementById('applicationForm').reset();
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при отправке заявки: ' + error.message);
    }
});