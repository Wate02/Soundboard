// main.js

// Initialize Firebase
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

// Reference to the "Sounds" collection
const soundsRef = firebase.database().ref('Sounds');
displaySoundsAsList();
// Function to add sound with name and url to the collection
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
    // Read sounds data once
    soundsRef.once('value', (snapshot) => {
        const soundsList = document.getElementById('soundsList');
        // Clear previous list
        soundsList.innerHTML = '';
        // Iterate over each sound
        snapshot.forEach((childSnapshot) => {
            const soundData = childSnapshot.val();
            // Create sound card div
            const soundCard = document.createElement('div');
            soundCard.classList.add('soundcard');
            
            // Create image element
            const imgElement = document.createElement('img');
            imgElement.src = soundData.Img; // Set image source
            imgElement.id = 'thumbnail';
            // Set onclick function to play sound
            imgElement.onclick = function() {
                play(soundData.Url);
            };
            // Append image to sound card
            soundCard.appendChild(imgElement);
            
            // Create name element
            const nameElement = document.createElement('text');
            nameElement.textContent = soundData.Name; // Set name text
            nameElement.id = 'nametext';
            // Append name to sound card
            soundCard.appendChild(nameElement);
            
            // Append sound card to soundsList
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
  // Example call to the addSound function
  addSound("tallaa", "https://example.com/sound.mp3", "img/default.jpeg");

}

function bypass() {
  displaySoundsAsList();
}

// Function to upload sound file
// Function to upload sound file
// Function to upload sound file
function uploadSound() {
    // Prompt user to select a file
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*'; // Accept audio files only
    input.onchange = (event) => {
        const file = event.target.files[0]; // Get selected file
        if (file) {
            // Generate a unique key for the sound
            const soundKey = soundsRef.push().key;
            const storageRef = firebase.storage().ref(`sounds/${soundKey}/${file.name}`);
            
            // Upload file to Firebase Storage
            const uploadTask = storageRef.put(file);
            
            // Create progress bar
            const progressBar = document.createElement('progress');
            progressBar.value = 0;
            progressBar.max = 100;
            document.body.appendChild(progressBar); // Append progress bar to DOM
            
            // Update progress bar during upload
            uploadTask.on('state_changed', (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                progressBar.value = progress;
            }, (error) => {
                console.error('Error uploading file:', error);
            }, () => {
                console.log('File uploaded successfully.');
                // Get download URL of the uploaded file
                storageRef.getDownloadURL().then((url) => {
                    console.log('File download URL:', url);
                    // Prompt user to enter name for the sound
                    const soundName = prompt('Enter name for the sound:');
                    if (soundName) {
                        // Add sound to database with name, URL, and image URL
                        addSound(soundName, url, "img/default.jpeg");
                    } else {
                        console.log('No sound name entered.');
                    }
                    // Remove progress bar from DOM after upload is complete
                    progressBar.remove();
                }).catch((error) => {
                    console.error('Error getting download URL:', error);
                    progressBar.remove(); // Remove progress bar in case of error
                });
            });
        } else {
            console.log('No file selected.');
        }
    };
    input.click(); // Open file selection dialog
}

function uploadsite() {
  window.location.replace("upload.html");
}


//function play(audioUrl) {
  //const audio = new Audio(audioUrl);
  //audio.muted = false;
  //audio.play();
//}
let currentAudio = null;

function play(audioUrl) {
  if (currentAudio) {
    currentAudio.pause(); // Vorheriges Audio stoppen, falls vorhanden
  }

  const audio = new Audio(audioUrl);
  audio.muted = false;
  audio.play();

  currentAudio = audio; // Aktuelles Audio setzen
}


