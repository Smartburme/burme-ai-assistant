// js/firebaseConfig.js

const firebaseConfig = {
    apiKey: "AIzaSyDJIEau3tH_E5JavhBxvaDt5oXDIveizdQ", // Correctly matches your Web API Key
    authDomain: "smart-burme.firebaseapp.com",         // Correctly matches your project structure
    databaseURL: "https://smart-burme-default-rtdb.firebaseio.com", // Correctly matches your Realtime Database URL
    projectId: "smart-burme",                          // Correctly matches your Project ID
    storageBucket: "smart-burme.firebasestorage.app",  // Correctly matches your Storage Bucket
    messagingSenderId: "827488800415",                 // Correctly matches your Project Number
    appId: "1:827488800415:web:f29e0e1dfa84794b4abdf7", // Correctly matches your Web App ID
    measurementId: "G-N0YGXKXSE4"                      // Measurement ID (optional for most apps, but present)
};

let firebaseApp;
try {
    if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        console.log("Firebase initialized successfully.");
    } else {
        firebaseApp = firebase.app();
        console.log("Firebase already initialized.");
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}
