// js/firebaseConfig.js

// Firebase Configuration details. Replace with your actual project details.
const firebaseConfig = {
    apiKey: "AIzaSyDJIEau3tH_E5JavhBxvaDt5oXDIveizdQ",
    authDomain: "smart-burme.firebaseapp.com",
    projectId: "smart-burme",
    storageBucket: "smart-burme.appspot.com", // ✅ fixed .com
    messagingSenderId: "827488800415",
    appId: "1:827488800415:web:7553f4d59d8c6a0f119caa",
    measurementId: "G-N0YGXKXSE4"
};

// Initialize Firebase App if not already initialized
let firebaseApp = null;

try {
    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase initialized successfully.");
    } else {
        firebaseApp = firebase.app();
        console.log("ℹ️ Firebase already initialized.");
    }
} catch (error) {
    console.error("❌ Firebase initialization error:", error);
}
