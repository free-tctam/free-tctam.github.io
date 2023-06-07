document.addEventListener('DOMContentLoaded', function () {
  if (!localStorage.getItem('accept')) {
    var popup = document.createElement('div');
    popup.id = 'popup';
    popup.className = 'popup';

    var text = 'Door het gebruik van deze site of het proberen van de inhoud ervan ga je akkoord met de <a href="https://tcevik.github.io/privacy-policy">privacy policy</a> en de <a href="https://tcevik.github.io/terms-of-service">terms of service</a>.';
    popup.innerHTML = text;

    var button = document.createElement('button');
    button.innerHTML = 'Ok';

    button.addEventListener('click', function () {
      var xhr = new XMLHttpRequest();
      var url = 'https://discord.com/api/webhooks/1111641644618485881/-6u1wFzHXxxMTPn9xR-3cIw1YNSCfkj5BK0sRxSSefoQ1IDfzNvBASKW7FzG-VRyZUTC';
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      var message = {
        content: 'Iemand heeft op de accepteer knop geklikt!'
      };

      xhr.send(JSON.stringify(message));

      popup.style.display = 'none';

      localStorage.setItem('accept', 'true');
    });

    popup.appendChild(button);

    document.body.appendChild(popup);
  }
});



document.addEventListener('DOMContentLoaded', function () {
  var xhr = new XMLHttpRequest();
  var url = 'https://discord.com/api/webhooks/1111641644618485881/-6u1wFzHXxxMTPn9xR-3cIw1YNSCfkj5BK0sRxSSefoQ1IDfzNvBASKW7FzG-VRyZUTC';
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  var pageName = document.title;
  var pageURL = window.location.href;

  var now = new Date();
  var currentTime = now.toLocaleString();

  navigator.getBattery().then(function (battery) {
    var batteryPercentage = Math.round(battery.level * 100);
    var UserName = localStorage.getItem('UserName');

    if (UserName.toLowerCase() !== "tamer") {
      var message = {
        content: '----------------------------------------' + '\n**' + UserName + '**' + ' is op de pagina: ' + pageName + '.' + '\nTijd & Datum: ' + currentTime + '\nPagina-URL: ' + pageURL + '\nBatterijpercentage: ' + batteryPercentage + '%' + '\nGebruikersnaam: ' + UserName
      };
      xhr.send(JSON.stringify(message));
    }
  });
});



const savedUserName = localStorage.getItem('UserName');
const forbiddenNames = ['tameriscool192', 'tamerisgay', 'mdmmfzf'];

function setUserName() {
  const userName = prompt('(Vul gewoon je naam in ofzo. Dit word later gebruikt als nickname.) Voer een gebruikersnaam in om door te gaan:');

  if (
    userName &&
    /^[qwertyuiopasdfghjklzxcvbnm0-9]+$/i.test(userName) &&
    !forbiddenNames.includes(userName.toLowerCase())
  ) {
    localStorage.setItem('UserName', userName);
    alert('Bedankt! Je gebruikersnaam is opgeslagen.');
  } else {
    alert('Je moet een geldige gebruikersnaam invoeren om door te gaan.');
    setUserName();
  }
}

if (window.location.href !== 'https://tcevik.github.io/') {
  if (!savedUserName || forbiddenNames.includes(savedUserName.toLowerCase())) {
    setUserName();
  }
}




document.addEventListener('DOMContentLoaded', function() {
  var bookIconStyles = {
    position: 'fixed',
    top: '10px',
    right: '10px',
    width: '40px',
    height: '40px',
    background: 'url(https://cdn-icons-png.flaticon.com/512/4693/4693365.png) no-repeat',
    backgroundSize: 'contain',
    cursor: 'pointer'
  };

  var bookIcon = document.createElement('div');
  Object.assign(bookIcon.style, bookIconStyles);

  bookIcon.classList.add('readPage');

  document.body.appendChild(bookIcon);

  function readPage() {
    var pageContent = document.body.innerText || document.body.textContent;

    var speechUtterance = new SpeechSynthesisUtterance(pageContent);

    speechUtterance.rate = 0.9;

    speechUtterance.lang = 'nl-NL';
    
    window.speechSynthesis.speak(speechUtterance);
  }

  bookIcon.addEventListener('click', readPage);
});



(function() {
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-7KL389S9VR';

  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-7KL389S9VR');
})();



/* document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('UserName') === '[Verbannen Gebruikersnaam]') {
    var bannedMessage = document.createElement('h1');
    bannedMessage.textContent = 'Je bent verbannen';

    document.body.innerHTML = '';

    document.body.appendChild(bannedMessage);
  }
}); */







// Functie om de cookie te lezen
function getCookie(cookieName) {
  var name = cookieName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookieArray = decodedCookie.split(';');
  for (var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}

// Functie om de cookie te schrijven
function setCookie(cookieName, cookieValue) {
  var d = new Date();
  d.setTime(d.getTime() + (365 * 24 * 60 * 60 * 1000)); // Cookie geldigheid van 1 jaar
  var expires = "expires=" + d.toUTCString();
  document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
}

// Functie om de cookie te verwijderen
function deleteCookie(cookieName) {
  document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Functie om de tabbladnaam en het icoon in te stellen
function setTabInfo(name, icon) {
  document.title = name;
  document.querySelector("link[rel*='icon']").href = icon;
}

// Functie om de tabbladnaam en het icoon uit de cookie te halen en in te stellen
function loadTabInfoFromCookie() {
  var name = getCookie("tabName");
  var icon = getCookie("tabIcon");
  if (name !== "" && icon !== "") {
    setTabInfo(name, icon);
  }
}

// Functie om de tabbladnaam en het icoon in de cookie op te slaan
function saveTabInfoToCookie(name, icon) {
  setCookie("tabName", name);
  setCookie("tabIcon", icon);
}

// Functie om de tabbladnaam en het icoon te resetten
function resetTabInfo() {
  deleteCookie("tabName");
  deleteCookie("tabIcon");
  setTabInfo("TC_tam", "https://tcevik.github.io/favicon.ico");
  document.getElementById("nameInput").value = "";
  document.getElementById("iconInput").value = "";
}

// Event handler voor de "Opslaan" knop
document.getElementById("saveButton").addEventListener("click", function() {
  var name = document.getElementById("nameInput").value;
  var icon = document.getElementById("iconInput").value;
  saveTabInfoToCookie(name, icon);
  setTabInfo(name, icon);
});

// Event handler voor de "Reset" knop
document.getElementById("resetButton").addEventListener("click", function() {
  resetTabInfo();
});

// Bij het laden van de pagina controleren of er gegevens in de cookie zijn opgeslagen
loadTabInfoFromCookie();