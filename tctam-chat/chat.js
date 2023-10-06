const database = firebase.database();
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatOutput = document.getElementById('chat-output'); 

let lastMessageTime = 0;
let lastMessageTimeForSpecialEmail = 0;
let enterKeyEnabled = true; // Houd bij of de Enter-toets is ingeschakeld

function canSendMessage(email) {
    const currentTime = Date.now();
    if (email === 'tam.cevik123@gmail.com') {
        const timeSinceLastMessage = currentTime - lastMessageTimeForSpecialEmail;
        return timeSinceLastMessage >= 0;
    } else {
        const timeSinceLastMessage = currentTime - lastMessageTime;
        return timeSinceLastMessage >= 3000;
    }
}

function updateLastMessageTime(email) {
    const currentTime = Date.now();
    if (email === 'tam.cevik123@gmail.com') {
        lastMessageTimeForSpecialEmail = currentTime;
    } else {
        lastMessageTime = currentTime;
    }
}

function sendMessage(email, message) {
    const timestamp = Date.now();
    const messageData = {
        timestamp: timestamp,
        email: email,
        message: message,
    };

    database.ref('chat').push(messageData);
}

function updateSendButtonStatus(emailVerified) {
    if (emailVerified) {
        sendButton.disabled = false;
        sendButton.textContent = 'Verzend';
        enterKeyEnabled = true; // Schakel de Enter-toets in
    } else {
        sendButton.disabled = true;
        sendButton.textContent = 'Verifieer je e-mail om te verzenden';
        enterKeyEnabled = false; // Schakel de Enter-toets uit
    }
}

sendButton.addEventListener('click', () => {
    const email = firebase.auth().currentUser.email;
    const message = messageInput.value;

    if (message.trim() !== '') {
        if (canSendMessage(email)) {
            sendMessage(email, message);
            messageInput.value = '';
            updateLastMessageTime(email);
        } else {
            alert('Je moet even wachten voordat je een nieuw bericht kunt sturen.');
        }
    }
});

messageInput.addEventListener('keydown', (event) => {
    const email = firebase.auth().currentUser.email;
    const message = messageInput.value;

    if (event.key === 'Enter' && enterKeyEnabled) {
        if (message.trim() !== '') {
            if (canSendMessage(email)) {
                sendMessage(email, message);
                messageInput.value = '';
                updateLastMessageTime(email);
            } else {
                alert('Je moet even wachten voordat je een nieuw bericht kunt sturen.');
            }
        }
    }
});

// Voeg e-mailverificatie toe
function checkEmailVerification() {
    const user = firebase.auth().currentUser;
    if (user) {
        updateSendButtonStatus(user.emailVerified);

        if (!user.emailVerified) {
            alert('Je e-mailadres is nog niet geverifieerd. Een bevestigingsmail is verzonden.');
            user.sendEmailVerification().catch((error) => {
                console.error('Fout bij het verzenden van de bevestigingsmail:', error);
            });
        }
    }
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        checkEmailVerification();
    }
});

database.ref('chat').orderByChild('timestamp').limitToLast(300).on('child_added', (snapshot) => {
    const messageData = snapshot.val();
    const email = messageData.email;
    const message = messageData.message;

    const messageElement = document.createElement('div');
    messageElement.textContent = email + ': ' + message;

    chatOutput.insertBefore(messageElement, chatOutput.firstChild);
});