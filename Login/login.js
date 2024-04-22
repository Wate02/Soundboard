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

const auth = firebase.auth();

const loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Anmeldeerfolg, du kannst den angemeldeten Benutzer abrufen
      console.log('Eingeloggt:', userCredential.user);
      // Weiterleitung oder andere Aktionen nach der Anmeldung
    })
    .catch(error => {
      console.error('Fehler bei der Anmeldung:', error.message);
      // Fehlerbehandlung
    });
});