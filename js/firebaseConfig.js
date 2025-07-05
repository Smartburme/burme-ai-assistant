// js/firebaseConfig.js

// Firebase Configuration details.
// Make sure these are correct for your Firebase project.
const firebaseConfig = {
    apiKey: "AIzaSyAr7Hv2ApKtNTxF11MhT5cuWeg_Dgsh0TY", // <<< YOUR API KEY
    authDomain: "smart-burme-app.firebaseapp.com",     // <<< YOUR AUTH DOMAIN
    projectId: "smart-burme-app",                      // <<< YOUR PROJECT ID
    storageBucket: "smart-burme-app.appspot.com",     // <<< YOUR STORAGE BUCKET
    messagingSenderId: "851502425686",                 // <<< YOUR MESSAGING SENDER ID
    appId: "1:851502425686:web:f29e0e1dfa84794b4abdf7" // <<< YOUR APP ID
};

let firebaseApp; // Declare firebaseApp globally

try {
    // Initialize Firebase only if it hasn't been initialized yet.
    // This prevents re-initialization errors if the script is somehow loaded multiple times.
    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully.");
    } else {
        // If Firebase is already initialized (e.g., by another script), get the existing app instance.
        firebaseApp = firebase.app();
        console.log("Firebase already initialized.");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
    // You should ideally handle this error in a user-friendly way.
    // For example, display a message indicating the app cannot load.
    // Example: document.body.innerHTML = '<p>Error initializing Firebase. Please try again later.</p>';
}

// IMPORTANT: Ensure firebaseApp is available for auth.js to use.
// auth.js should check if firebaseApp is defined before trying to access firebaseApp.auth().
// The current auth.js code already does this check.
