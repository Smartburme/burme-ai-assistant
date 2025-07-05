// js/firebaseConfig.js

const firebaseConfig = {
    apiKey: "AIzaSyAr7Hv2ApKtNTxF11MhT5cuWeg_Dgsh0TY",
    authDomain: "smart-burme-app.firebaseapp.com",
    projectId: "smart-burme-app",
    storageBucket: "smart-burme-app.appspot.com",
    messagingSenderId: "851502425686",
    appId: "1:851502425686:web:f29e0e1dfa84794b4abdf7"
};

let firebaseApp; // Declare firebaseApp globally
try {
    // Initialize Firebase only if it hasn't been initialized yet
    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully.");
    } else {
        firebaseApp = firebase.app(); // Get the existing app instance if already initialized
        console.log("Firebase already initialized.");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
    // Handle error: maybe show a message to the user that the app can't load.
}
// IMPORTANT: Ensure firebaseApp is available for auth.js to use.
  
