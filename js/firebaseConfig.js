// js/firebaseConfig.js

// Firebase Configuration details. Replace with your actual project details.
const firebaseConfig = {
    apiKey: "AIzaSyDJIEau3tH_E5JavhBxvaDt5oXDIveizdQ", // <<< REPLACE WITH YOUR ACTUAL API KEY
    authDomain: "smart-burme.firebaseapp.com",         // <<< REPLACE WITH YOUR ACTUAL AUTH DOMAIN
    projectId: "smart-burme",                          // <<< REPLACE WITH YOUR ACTUAL PROJECT ID
    storageBucket: "smart-burme.firebasestorage.app",  // <<< REPLACE WITH YOUR ACTUAL STORAGE BUCKET
    messagingSenderId: "827488800415",                 // <<< REPLACE WITH YOUR ACTUAL MESSAGING SENDER ID
    appId: "1:827488800415:web:7553f4d59d8c6a0f119caa", // <<< REPLACE WITH YOUR ACTUAL APP ID
    measurementId: "G-N0YGXKXSE4"                      // Measurement ID (optional)
};

let firebaseApp = null; // Declare firebaseApp globally, initialize to null

try {
    // Initialize Firebase only if it hasn't been initialized yet.
    // This check prevents re-initialization errors.
    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully.");
    } else {
        // If Firebase is already initialized (e.g., by another script), get the existing app instance.
        firebaseApp = firebase.app();
        console.log("Firebase already initialized, using existing instance.");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
    // Handle error: Display a user-friendly message if initialization fails.
    // For example, if this is the only critical script, you might want to stop execution.
    // Note: In index.html, we'll catch errors from checkAuthState which relies on this.
}

// Export firebaseApp if you plan to use modules and import it elsewhere
// export { firebaseApp };
