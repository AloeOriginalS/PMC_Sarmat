    const functions = require('firebase-functions');
    const SibApiV3Sdk = require('@sendinblue/client');
    const admin = require('firebase-admin');
    admin.initializeApp();

    // Configure environment variables
    const sendinblueApiKey = functions.config().sendinblue.apikey;
    const fromEmail = functions.config().sendinblue.fromemail;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const apiKey = SibApiV3Sdk.ApiClient.instance.authentications['api-key'];
    apiKey.apiKey = sendinblueApiKey;

    exports.sendApprovalEmail = functions.firestore
        .document('applications/{docId}')
        .onUpdate(async (change, context) => {
            const newData = change.after.data();
            const prevData = change.before.data();

            if (newData.status === 'approved' && prevData.status !== 'approved' && newData.email && newData.tempPassword) {
                const sendSmtpEmail = {
                    to: [{ email: newData.email }],
                    sender: { email: fromEmail, name: 'ЧВК "Сармат"' },
                    subject: 'Ваша заявка одобрена',
                    htmlContent: `
                        <h2>Добро пожаловать в ряды, ${newData.robloxNickname}!</h2>
                        <p>Ваши данные для входа:</p>
                        <ul>
                            <li><strong>Email:</strong> ${newData.email}</li>
                            <li><strong>Пароль:</strong> ${newData.tempPassword}</li>
                        </ul>
                        <p>Пожалуйста, смените пароль после входа.</p>
                        <a href="https://ваш-сайт/profile.html">Войти в личный кабинет</a>
                    `
                };

                try {
                    await apiInstance.sendTransacEmail(sendSmtpEmail);
                    console.log('Email отправлен на', newData.email);
                    return null;
                } catch (error) {
                    console.error('Ошибка отправки email:', error);
                    return null;
                }
            }
            return null;
        });
    
