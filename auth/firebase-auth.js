var auth = firebase.auth();
var loginForm = document.getElementById('login');
var dashboard = document.getElementById('dashboard');

// Functie om inlogformulier en gebruikersinformatie te tonen/verbergen
function toggleUI(isLoggedIn) {
    loginForm.style.display = isLoggedIn ? 'none' : 'block';
    dashboard.style.display = isLoggedIn ? 'block' : 'none';
}

function checkEmailVerification() {
    setTimeout(() => {
        const user = firebase.auth().currentUser;
        if (user) {

            if (!user.emailVerified) {
                notification('Je e-mailadres is nog niet geverifieerd. Een bevestigingsmail is verzonden.');
                user.sendEmailVerification().catch((error) => {
                    notification('Fout bij het verzenden van de bevestigingsmail:' + error);
                });
            }
        }
    }, "3000");
}

function getUserDataFromFirebase() {
    var user = firebase.auth().currentUser;
    var userEmail = user ? user.email : "Geen e-mail gevonden";
    var userName = user ? (user.displayName ? user.displayName : "") : "Geen gebruiker ingelogd";
    var photoURL = user ? (user.photoURL ? user.photoURL : "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg") : "Geen profielfoto gevonden";

    document.getElementById("user-email").innerHTML = 'Je email is: ' + userEmail;
    document.getElementById("name-input").value = userName;
    document.getElementById("pic-input").value = photoURL;
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        setTimeout(() => {
            checkEmailVerification();
            getUserDataFromFirebase();
            redirectToUrl();
        }, "2500");
    }
});

function redirectToUrl() {
    var currentUrl = window.location.href;
    
    if (currentUrl.includes("?")) {
        var parts = currentUrl.split("?");
        if (parts[1]) {
            var redirectTo = parts[1];
            window.location.href = redirectTo;
        }
    }
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
            localStorage.setItem('loggedIn', 'true');
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

// Uitloggen
document.getElementById('logout-btn').addEventListener('click', function () {
    auth.signOut()
        .then(function () {
            notification('Gebruiker uitgelogd');
            toggleUI(false);
            localStorage.setItem('loggedIn', 'false');
        })
        .catch(function (error) {
            notification('Fout bij uitloggen:', error.message);
        });
});

function changePassword() {
    var user = firebase.auth().currentUser;

    if (user) {
        var newPassword = prompt("New password:");

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
    var userEmail = prompt("Enter your email:");

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