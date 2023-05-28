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

    if (UserName !== "Tamer") {
      var message = {
        content: '----------------------------------------' + '\n**' + UserName + '**' + ' is op de pagina: ' + pageName + '.' + '\nTijd & Datum: ' + currentTime + '\nPagina-URL: ' + pageURL + '\nBatterijpercentage: ' + batteryPercentage + '%' + '\nGebruikersnaam: ' + UserName
      };
      xhr.send(JSON.stringify(message));
    }
  });
});



const savedUserName = localStorage.getItem('UserName');

function setUserName() {
  const UserName = prompt('Voer een gebruikersnaam in om door te gaan:');

  if (UserName && /^[qwertyuiopasdfghjklzxcvbnm_\-0-9]+$/i.test(UserName)) {
    localStorage.setItem('UserName', UserName);
    alert('Bedankt! Je gebruikersnaam is opgeslagen.');
  } else {
    alert('Je moet een geldige gebruikersnaam invoeren om door te gaan.');
    setUserName();
  }
}

if (window.location.href !== 'https://tcevik.github.io/') {
  if (!savedUserName) {
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




document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('UserName') === '[Verbannen Gebruikersnaam]') {
    var bannedMessage = document.createElement('h1');
    bannedMessage.textContent = 'Je bent verbannen';

    document.body.innerHTML = '';

    document.body.appendChild(bannedMessage);
  }
});





































// Voeg een event listener toe aan alle link-elementen
document.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function(event) {
    event.preventDefault(); // Voorkom het standaardgedrag van de link

    // Maak een nieuw element aan voor de overlay
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'black';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity 0.25s';

    // Voeg de overlay toe aan de body
    document.body.appendChild(overlay);

    // Fade-in effect van de overlay
    setTimeout(function() {
      overlay.style.opacity = '1';
    }, 0);

    // Wacht 0,25 seconden voordat de navigatie plaatsvindt
    setTimeout(function() {
      window.location.href = link.href;
    }, 250);
  });
});

// Voeg een event listener toe aan het window object om te reageren op het laden van de nieuwe pagina
window.addEventListener('load', function() {
  // Vind de overlay
  var overlay = document.querySelector('div.overlay');

  // Fade-out effect van de overlay
  setTimeout(function() {
    overlay.style.opacity = '0';
    setTimeout(function() {
      // Verwijder de overlay na het fade-out effect
      overlay.parentNode.removeChild(overlay);
    }, 250);
  }, 0);
});
