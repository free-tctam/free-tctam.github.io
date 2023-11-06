var auth = firebase.auth();
var loginForm = document.getElementById('login');
var userInfo = document.getElementById('user-info');
var chat = document.getElementById('chat'); // Voeg chat toe aan je code

// Functie om inlogformulier en gebruikersinformatie te tonen/verbergen
function toggleUI(isLoggedIn) {
    loginForm.style.display = isLoggedIn ? 'none' : 'block';
    userInfo.style.display = isLoggedIn ? 'block' : 'none';
    chat.style.display = isLoggedIn ? 'block' : 'none';
}

// Inlogstatus controleren bij het laden van de pagina
window.addEventListener('load', function () {
    var loggedIn = localStorage.getItem('loggedIn');
    toggleUI(loggedIn === 'true'); // Converteer de waarde naar een boolean
});

// Inloggen / Registreren
document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var loginEmail = document.getElementById('login-email').value;
    var loginPassword = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(loginEmail, loginPassword)
        .then(function (userCredential) {
            var user = userCredential.user;
            console.log('Gebruiker ingelogd:', user.email);
            notification('Ingelogd!');
            toggleUI(true);
            localStorage.setItem('loggedIn', 'true'); // Stel loggedIn in op 'true' bij inloggen
            localStorage.setItem('userEmail', user.email); // Sla de gebruikers-e-mail op
        })
        .catch(function (error) {
            // Als inloggen mislukt, probeer te registreren
            auth.createUserWithEmailAndPassword(loginEmail, loginPassword)
                .then(function (userCredential) {
                    console.log('Gebruiker geregistreerd:', userCredential.user.email);
                    notification('Registratie gelukt!');
                    toggleUI(true);
                    localStorage.setItem('loggedIn', 'true'); // Stel loggedIn in op 'true' bij registratie
                })
                .catch(function (error) {
                    console.error('Fout bij inloggen/registreren:', error.message);
                    notification('Fout bij inloggen/registreren: ' + error.message);
                });
        });
});

// Functie om in te loggen met Google
function loginWithGoogle() {
    firebase.auth()
        .signInWithPopup(googleProvider)
        .then((result) => {
            const user = result.user;
            console.log('Gebruiker ingelogd met Google:', user.email);
            notification('Ingelogd met Google!');
            toggleUI(true);
            localStorage.setItem('loggedIn', 'true'); // Stel loggedIn in op 'true' bij inloggen
            localStorage.setItem('userEmail', user.email); // Sla de gebruikers-e-mail op
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Fout bij inloggen met Google:', errorCode, errorMessage);
            notification('Fout bij inloggen met Google: ' + errorMessage);
        });
}

// Uitloggen
document.getElementById('logout-btn').addEventListener('click', function () {
    auth.signOut()
        .then(function () {
            console.log('Gebruiker uitgelogd');
            toggleUI(false);
            localStorage.setItem('loggedIn', 'false');
        })
        .catch(function (error) {
            console.error('Fout bij uitloggen:', error.message);
        });
});

// Voeg code toe om wachtwoord te wijzigen
function changePassword() {
    var user = firebase.auth().currentUser;

    if (user) {
        var newPassword = prompt("Voer uw nieuwe wachtwoord in:");

        if (newPassword !== null) {
            user.updatePassword(newPassword)
                .then(function () {
                    notification('Wachtwoord is succesvol gewijzigd.');
                })
                .catch(function (error) {
                    console.error('Fout bij het wijzigen van het wachtwoord:', error.message);
                    notification('Fout bij het wijzigen van het wachtwoord: ' + error.message);
                });
        }
    }
}

// Voeg code toe om wachtwoord te resetten
document.getElementById('reset-password-btn').addEventListener('click', function () {
    var userEmail = prompt("Voer uw e-mailadres in om uw wachtwoord te resetten:");

    if (userEmail !== null) {
        firebase.auth().sendPasswordResetEmail(userEmail)
            .then(function () {
                notification('Een e-mail met instructies voor het resetten van uw wachtwoord is verzonden naar ' + userEmail);
            })
            .catch(function (error) {
                console.error('Fout bij het verzenden van de wachtwoordreset-e-mail:', error.message);
                notification('Fout bij het verzenden van de wachtwoordreset-e-mail: ' + error.message);
            });
    }
});