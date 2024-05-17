const firebaseConfig = {
    apiKey: "${{ APIKEY }}",
    authDomain: "soundboard-d566d.firebaseapp.com",
    projectId: "soundboard-d566d",
    storageBucket: "soundboard-d566d.appspot.com",
    messagingSenderId: "568367814492",
    appId: "1:568367814492:web:0b1df119b74ac90c345399",
    measurementId: "G-6V1CJ3ZQWF"
};

firebase.initializeApp(firebaseConfig);

console.log('Firebase initialized.');

const soundsRef = firebase.database().ref('Sounds');
displaySoundsAsList();

function addSound(name, url, img) {
    soundsRef.push({
        Name: name,
        Url: url,
        Img: img
    }).then(() => {
        console.log('Sound added successfully.');
    }).catch((error) => {
        console.error('Error adding sound: ', error);
    });
}

function displaySoundsAsList() {
    soundsRef.once('value', (snapshot) => {
        const soundsList = document.getElementById('soundsList');

        soundsList.innerHTML = '';

        const soundsArray = [];

        snapshot.forEach((childSnapshot) => {
            const soundData = childSnapshot.val();
            soundsArray.push(soundData);
        });

        // Shuffle the soundsArray
        for (let i = soundsArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [soundsArray[i], soundsArray[j]] = [soundsArray[j], soundsArray[i]];
        }

        soundsArray.forEach((soundData) => {
            const soundCard = document.createElement('div');
            soundCard.classList.add('soundcard');

            const imgElement = document.createElement('img');
            imgElement.src = soundData.Img;
            imgElement.id = 'thumbnail';

            imgElement.onclick = function() {
                play(soundData.Url);
            };

            soundCard.appendChild(imgElement);

            const nameElement = document.createElement('text');
            nameElement.textContent = soundData.Name;
            nameElement.id = 'nametext';

            soundCard.appendChild(nameElement);

            soundsList.appendChild(soundCard);
        });
    }).catch((error) => {
        console.error('Error reading sounds: ', error);
    });
}

function report() {
  window.location.replace("https://github.com/Wate02/Soundboard/issues");
}

function shit() {

  addSound("tallaa", "https://example.com/sound.mp3", "img/default.jpeg");

}

function displayrandom() {
  window.location.replace("https://wate02.github.io/Soundboard/");
}

function bypass() {
  displaySoundsAsList();
}

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

function uploadsite() {
  window.location.replace("upload.html");
}

let currentAudio = null;

function play(audioUrl) {
  if (currentAudio) {
    currentAudio.pause(); 
  }

  const audio = new Audio(audioUrl);
  audio.muted = false;
  audio.play();

  currentAudio = audio; 
}

function stopbutton(){
currentAudio.pause(); 
}

function openNav() {
  var x = document.getElementById("options");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}


//fab toggle

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



// lightmode
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
