const database = firebase.database();
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatOutput = document.getElementById('chat-output'); 

let lastMessageTime = 0;
let lastMessageTimeForSpecialEmail = 0;
let enterKeyEnabled = true; // Houd bij of de Enter-toets is ingeschakeld

function canSendMessage(email) {
    const currentTime = Date.now();
    if (email === 'tam.cevik123@gmail.com' || email === 'tamer.cevik@vlietlandcollege.nl') {
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
        deleteOldMessages();
    }
});

const uiInput = document.getElementById('ui-input');

let prevEmail = null;
let prevMessageElement = null;
let isFirstMessage = true;

database.ref('chat').on('child_removed', (snapshot) => {
    const deletedMessageKey = snapshot.key;
    const deletedMessageElement = document.querySelector(`[data-key='${deletedMessageKey}']`);
    if (deletedMessageElement) {
        deletedMessageElement.remove();
    }
});

database.ref('chat').orderByChild('timestamp').limitToLast(300).on('child_added', (snapshot) => {
    const messageData = snapshot.val();
    const email = messageData.email;
    const message = messageData.message;

    const messageElement = document.createElement('div');
    const messageContent = linkifyText(message);

    const modifiedEmail = email.replace(/@.*/g, '');

    if (prevEmail !== modifiedEmail) {
        const emailElement = document.createElement('strong');
        emailElement.textContent = modifiedEmail + ': ';

        chatOutput.appendChild(emailElement);
        emailElement.style.display = 'block';
        emailElement.style.marginTop = '40px';
        emailElement.style.marginBottom = '5px';
        emailElement.style.marginLeft = '40px';
        emailElement.style.wordBreak = 'break-word';
        emailElement.style.textAlign = 'left';

        if (prevEmail !== null) {
            messageElement.style.marginTop = '5px';
        }
        prevEmail = modifiedEmail;
    } else {
        messageElement.style.marginTop = '0px';
    }

    messageElement.appendChild(messageContent);
    chatOutput.appendChild(messageElement);

    messageElement.style.marginBottom = '0px';
    messageElement.style.marginLeft = '50px';
    messageElement.style.wordBreak = 'break-word';
    messageElement.style.textAlign = 'left';
    messageElement.style.paddingLeft = '5px';
    messageElement.style.paddingBottom = '2px';
    messageElement.style.paddingTop = '2px';
    messageElement.style.borderLeft = 'solid 4px var(--h1234-color)';

    messageElement.setAttribute('data-key', snapshot.key);

    chatOutput.scrollTop = chatOutput.scrollHeight;

    const currentUserEmail = firebase.auth().currentUser.email;
    if (currentUserEmail === email) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.style.padding = '0px';
        deleteButton.style.marginLeft = '10px';
        deleteButton.style.color = 'red';
        deleteButton.style.cursor = 'pointer';

        deleteButton.addEventListener('click', () => {
            database.ref('chat').child(snapshot.key).remove();
        });

        messageElement.appendChild(deleteButton);
    }
});

function linkifyText(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const messageNode = document.createElement('span');
    let lastIndex = 0;
    text.replace(urlRegex, function (url, index) {
        const before = text.substring(lastIndex, index);
        const linkNode = document.createElement('a');
        linkNode.href = url;
        linkNode.target = "_blank";
        linkNode.textContent = url;
        messageNode.appendChild(document.createTextNode(before));
        messageNode.appendChild(linkNode);
        lastIndex = index + url.length;
    });
    if (lastIndex < text.length) {
        messageNode.appendChild(document.createTextNode(text.substring(lastIndex)));
    }
    return messageNode;
}

function deleteOldMessages() {
    const messagesRef = database.ref('chat');
    messagesRef.once('value', (snapshot) => {
        const messages = snapshot.val();
        const messageCount = Object.keys(messages).length;
        if (messageCount > 300) {
            const messagesToDelete = Object.keys(messages).slice(0, messageCount - 300);
            messagesToDelete.forEach((messageKey) => {
                messagesRef.child(messageKey).remove();
            });
        }
    });
}