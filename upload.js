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

const storageRef = firebase.storage().ref();

const databaseRef = firebase.database().ref();

function uploadImage() {
  const file = document.getElementById('imageUpload').files[0];
  const imageRef = storageRef.child('images/' + file.name);

  const progressBar = document.createElement('progress');
  document.getElementById('selectedFiles').appendChild(progressBar);

  imageRef.put(file).on('state_changed',
    function(snapshot) {

      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressBar.value = progress;

    },
    function(error) {
      console.error('Fehler beim Hochladen des Bildes:', error);
    },
    function() {

      progressBar.remove();

      imageRef.getDownloadURL().then(function(url) {

        document.getElementById('imagePreview').src = url;

        const name = document.getElementById('soundNameInput').value;
        databaseRef.push({
          name: name,
          imageUrl: url
        });
      });
    }
  );
}


document.getElementById('imageUpload').addEventListener('change', uploadImage);

document.getElementById('audioUpload').addEventListener('change', uploadAudio);

function filePicker() {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*'; 

    input.addEventListener('change', (event) => {
      const selectedFile = event.target.files[0];
      resolve(selectedFile); 
    });

    input.click();

    setTimeout(() => {
      reject(new Error("No audio file selected.")); 
    }, 5000); 
  });
}

function addSound() {

  const name = document.getElementById('soundNameInput').value; 
  const imageUrl = document.getElementById('imagePreview').src; 
  const soundUrl = document.getElementById('audioPlayer').src; 

  const newSound = {
    Name: name,
    Img: imageUrl,
    Url: soundUrl
  };

  const databaseRef = firebase.database().ref('Sounds');

  databaseRef.push(newSound)
    .then(() => {
      console.log("Sound added successfully!");
      window.location.replace("index.html");
    })
    .catch((error) => {
      console.error("Error adding sound:", error);
    });
}

function generateRandomDirectoryName() {

  const randomString = Math.random().toString(36).substring(2, 15);
  return `sounds/${randomString}`;
}



// Funktion zum Hochladen der Datei und Aktualisieren des Audio-Players
function uploadFileAndSetAudioSource(file) {
  // Datei-Referenz im Storage
  const fileRef = storageRef.child(file.name);

  // Datei hochladen
  const uploadTask = fileRef.put(file);

  // Fortschrittsbalken aktualisieren
  uploadTask.on('state_changed',
    function(snapshot) {
      // Fortschritt in Prozent berechnen
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      // Hier kannst du den Fortschrittsbalken aktualisieren
    },
    function(error) {
      // Bei einem Fehler während des Uploads
      console.error('Error uploading file:', error);
    },
    function() {
      // Wenn der Upload abgeschlossen ist
      console.log('File uploaded successfully');
      // Datei-URL abrufen
      fileRef.getDownloadURL().then(function(url) {
        console.log('File URL:', url);
        // Audio-Player aktualisieren
        const audioPlayer = document.getElementById('audioPlayer');
        audioPlayer.src = url;
      }).catch(function(error) {
        console.error('Error getting download URL:', error);
      });
    }
  );
}

// Event-Handler für das Ändern des Datei-Eingabe-Elements
function handleFileInputChange(event) {
  const file = event.target.files[0];
  uploadFileAndSetAudioSource(file);
}

// Event-Handler für das Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('myfile');
  // Event-Handler für Datei-Eingabe hinzufügen
  fileInput.addEventListener('change', handleFileInputChange);
});

function uploadAudio() {
  const file = document.getElementById('audioUpload').files[0];
  const audioRef = storageRef.child('audio/' + file.name);

  const progressBar = document.createElement('progress');
  document.getElementById('selectedFiles').appendChild(progressBar);

  audioRef.put(file).on('state_changed',
    function(snapshot) {

      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressBar.value = progress;

    },
    function(error) {
      console.error('Fehler beim Hochladen der Audiodatei:', error);
    },
    function() {

      progressBar.remove();

      audioRef.getDownloadURL().then(function(url) {

        document.getElementById('audioPlayer').src = url;

        const name = document.getElementById('soundNameInput').value;
        databaseRef.push({
          name: name,
          audioUrl: url
        });
      });
    }
  );
}
