// js/firebaseConfig.js
  const firebaseConfig = {
    apiKey: "AIzaSyAr7Hv2ApKtNTxF11MhT5cuWeg_Dgsh0TY",
    authDomain: "smart-burme-app.firebaseapp.com",
    projectId: "smart-burme-app",
    storageBucket: "smart-burme-app.appspot.com",
    messagingSenderId: "851502425686",
    appId: "1:851502425686:web:f29e0e1dfa84794b4abdf7"
};

let firebaseApp;
try {
    // Initialize Firebase if it hasn't been already
    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully.");
    } else {
        firebaseApp = firebase.app(); // Get existing app instance
        console.log("Firebase already initialized.");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}
