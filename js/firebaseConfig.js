// js/firebaseConfig.js
  const firebaseConfig = {
   apiKey: "AIzaSyCK8xFznYs4FFuH-JBmXhX69I9iIdFC-DY",
   authDomain: "smart-burme-ai.firebaseapp.com",
   databaseURL: "https://smart-burme-ai-default-rtdb.firebaseio.com",
   projectId: "smart-burme-ai",
   storageBucket: "smart-burme-ai.firebasestorage.app",
   messagingSenderId: "1057673784315",
   appId: "1:1057673784315:web:b7004e00ce88b7ecd3b95e",
   measurementId: "G-VDB178C50B"
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