// Firebase-Konfiguration
const firebaseConfig = {
    apiKey: "${{ APIKEY }}",
    authDomain: "soundboard-d566d.firebaseapp.com",
    projectId: "soundboard-d566d",
    storageBucket: "soundboard-d566d.appspot.com",
    messagingSenderId: "568367814492",
    appId: "1:568367814492:web:0b1df119b74ac90c345399",
    measurementId: "G-6V1CJ3ZQWF"
};

// Firebase initialisieren
firebase.initializeApp(firebaseConfig);
console.log('Firebase initialized.');

const soundsRef = firebase.database().ref('Sounds');
displaySoundsAsList();

// Funktion zum Hinzufügen eines Sounds zur Datenbank
function addSound(name, url, img) {
    soundsRef.push({
        Name: name,
        Url: url,
        Img: img,
        Plays: 0 // Neuer Eintrag für Abspielzähler
    }).then(() => {
        console.log('Sound added successfully.');
    }).catch((error) => {
        console.error('Error adding sound: ', error);
    });
}

// Funktion zur Anzeige der Sounds als Liste
function displaySoundsAsList() {
    soundsRef.once('value', (snapshot) => {
        const soundsList = document.getElementById('soundsList');
        soundsList.innerHTML = '';

        // Array, um alle Sound-Daten zu speichern
        const soundsArray = [];

        // Schleife durch die Datenbank-Snapshot-Einträge und pushe in das Array
        snapshot.forEach((childSnapshot) => {
            const soundData = childSnapshot.val();
            const soundKey = childSnapshot.key;
            soundData.key = soundKey; // Speichern des Keys für die spätere Verwendung
            soundsArray.push(soundData);
        });

        // Sortiere das Array nach der Anzahl der Plays (absteigend)
        soundsArray.sort((a, b) => (b.Plays || 0) - (a.Plays || 0));

        // Durch das sortierte Array iterieren und die Soundkarten anzeigen
        soundsArray.forEach((soundData) => {
            const soundCard = document.createElement('div');
            soundCard.classList.add('soundcard');

            const imgElement = document.createElement('img');
            imgElement.src = soundData.Img;
            imgElement.id = 'thumbnail';

            imgElement.onclick = function () {
                play(soundData.Url, soundData.key, soundData.Plays || 0); // Plays wird auf 0 gesetzt, falls nicht vorhanden
            };

            soundCard.appendChild(imgElement);

            const nameElement = document.createElement('text');
            nameElement.textContent = soundData.Name;
            nameElement.id = 'nametext';

            // Event-Listener für Klick auf den Namen
            nameElement.onclick = function () {
                window.location.href = `info.html?name=${encodeURIComponent(soundData.Name)}`;
            };

            soundCard.appendChild(nameElement);
            soundsList.appendChild(soundCard);
        });
    }).catch((error) => {
        console.error('Error reading sounds:', error);
    });
}


// Funktion zum Abspielen eines Sounds
let currentAudio = null;

function play(audioUrl, soundKey, currentCount) {
  if (currentAudio) {
    currentAudio.pause();
  }

  const audio = new Audio(audioUrl);
  audio.muted = false;
  audio.play();

  // Aktualisiere den Abspielzähler in der Datenbank, indem +1 addiert wird
  updatePlayCount(soundKey, currentCount + 1);

  currentAudio = audio;
}

// Funktion zum Aktualisieren des Abspielzählers
function updatePlayCount(soundKey, newCount) {
  soundsRef.child(soundKey).update({ Plays: newCount })
    .then(() => {
    
    })
    .catch((error) => {
      console.error('Error updating play count:', error);
    });
}

// Funktion zum Hochladen eines Sounds
function uploadSound() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*'; 
    input.onchange = (event) => {
        const file = event.target.files[0]; 
        if (file) {
            const soundKey = soundsRef.push().key;
            const storageRef = firebase.storage().ref(`sounds/${soundKey}/${file.name}`);
            const uploadTask = storageRef.put(file);

            const progressBar = document.createElement('progress');
            progressBar.value = 0;
            progressBar.max = 100;
            document.body.appendChild(progressBar); 

            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.value = progress;
            }, (error) => {
                console.error('Error uploading file:', error);
            }, () => {
                console.log('File uploaded successfully.');
                storageRef.getDownloadURL().then((url) => {
                    console.log('File download URL:', url);
                    const soundName = prompt('Enter name for the sound:');
                    if (soundName) {
                        addSound(soundName, url, "img/default.jpeg");
                    } else {
                        console.log('No sound name entered.');
                    }
                    progressBar.remove();
                }).catch((error) => {
                    console.error('Error getting download URL:', error);
                    progressBar.remove(); 
                });
            });
        } else {
            console.log('No file selected.');
        }
    };
    input.click(); 
}

// Weitere Funktionen (z.B. für Light Mode, Navigation, etc.)
function report() {
  window.location.replace("https://github.com/Wate02/Soundboard/issues");
}

function displayrandom() {
  window.location.replace("https://wate02.github.io/Soundboard/list/random");
}

function bypass() {
  displaySoundsAsList();
}

function uploadsite() {
  window.location.replace("upload.html");
}

function stopbutton() {
    if (currentAudio) {
        currentAudio.pause(); 
    }
}

function openNav() {
    var x = document.getElementById("options");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}

// FAB Toggle
function toggleFab() {
    const fabElement = document.querySelector('.fab');
    if (fabElement.style.display === 'none' || fabElement.style.display === '') {
        fabElement.style.display = 'block';
        localStorage.setItem('fabVisibility', 'visible');
    } else {
        fabElement.style.display = 'none';
        localStorage.setItem('fabVisibility', 'hidden');
    }
}

function restoreFabVisibility() {
    const fabVisibility = localStorage.getItem('fabVisibility');
    const fabElement = document.querySelector('.fab');
    if (fabVisibility === 'visible') {
        fabElement.style.display = 'block';
    } else if (fabVisibility === 'hidden') {
        fabElement.style.display = 'none';
    }
}

window.addEventListener('load', restoreFabVisibility);

// Light Mode
const lightModeEnabled = localStorage.getItem('lightMode') === 'enabled';

function enableLightMode() {
    document.body.classList.add('light-mode');
    localStorage.setItem('lightMode', 'enabled');
}

function disableLightMode() {
    document.body.classList.remove('light-mode');
    localStorage.setItem('lightMode', null);
}

if (lightModeEnabled) {
    enableLightMode();
}

document.getElementById('Lightmodebtn').addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
        disableLightMode();
    } else {
        enableLightMode();
    }
});
