//window.location.replace("index.html");
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

  // Create a new instance of Compressor using the uploaded file
  new Compressor(file, {
    quality: 0.1, // Adjust the compression quality (0.8 means 80%)
    width: 500,
    height: 500,
    success(compressedFile) {
      // Use the compressed file for uploading
      const imageRef = storageRef.child('images/' + compressedFile.name);

      const progressBar = document.createElement('progress');
      document.getElementById('selectedFiles').appendChild(progressBar);

      imageRef.put(compressedFile).on('state_changed',
        function(snapshot) {
          // Update progress bar
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          progressBar.value = progress;
        },
        function(error) {
          console.error('Error uploading image:', error);
        },
        function() {
          // Remove progress bar when upload completes
          progressBar.remove();

          // Get the download URL of the uploaded image
          imageRef.getDownloadURL().then(function(url) {
            // Display the uploaded image
            document.getElementById('imagePreview').src = url;

            // Add image data to the database
            //const name = document.getElementById('soundNameInput').value;
           // databaseRef.push({
          //    name: name,
    //          imageUrl: url
         //   });
          });
        }
      );
    },
    error(err) {
      console.error('Error compressing image:', err);
    }
  });
}


document.getElementById('imageUpload').addEventListener('change', uploadImage);

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

function uploadFileAndSetAudioSource(file) {
  // Specify the path in Firebase Storage for the file to be uploaded to /sounds
  const fileRef = storageRef.child('sounds/' + file.name);

  // Start the file upload task
  const uploadTask = fileRef.put(file);

  // Listen for state changes during the file upload
  uploadTask.on(
    'state_changed',
    function(snapshot) {
      // Calculate upload progress and log it to the console
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    },
    function(error) {
      // Handle any errors that may occur during the upload
      console.error('Error uploading file:', error);
    },
    function() {
      // Handle successful file upload
      console.log('File uploaded successfully');

      // Retrieve the download URL for the uploaded file
      fileRef.getDownloadURL()
        .then(function(url) {
          // Log the file URL to the console
          console.log('File URL:', url);

          // Update the audio player source with the uploaded file's URL
          const audioPlayer = document.getElementById('audioPlayer');
          audioPlayer.src = url;
        })
        .catch(function(error) {
          // Handle any errors that may occur while retrieving the download URL
          console.error('Error getting download URL:', error);
        });
    }
  );
}


function handleFileInputChange(event) {
  const file = event.target.files[0];
  uploadFileAndSetAudioSource(file);
}

document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('myfile');

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

        //const name = document.getElementById('soundNameInput').value;
        //databaseRef.push({
        //name: name,
        // audioUrl: url
       // });
      });
    }
  );
}

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


function back() {
  window.location.href = '../';

}