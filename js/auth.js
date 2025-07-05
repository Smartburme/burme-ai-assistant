// js/auth.js

let auth = null; // Initialize auth service variable to null
let firebaseAppInstance = null; // To hold the Firebase app instance

// Function to ensure Firebase app and Auth service are initialized.
// It returns a Promise that resolves with the auth service or rejects on error.
function initializeFirebaseAndAuth() {
    return new Promise((resolve, reject) => {
        // 1. Check if Firebase SDK scripts are loaded and firebase object is available.
        if (typeof firebase === 'undefined' || !firebase.initializeApp) {
            console.error("Firebase SDK scripts are not loaded or incomplete. Ensure scripts are correctly linked in HTML.");
            return reject("Firebase SDK not loaded.");
        }

        // 2. Check if Firebase app instance is already initialized.
        if (!firebaseAppInstance) {
            // If not initialized, try to initialize it using firebaseConfig.
            if (typeof firebase.apps === 'undefined' || firebase.apps.length === 0) {
                // Check if firebaseConfig is defined.
                if (typeof firebaseConfig === 'undefined') {
                    console.error("firebaseConfig is not defined. Ensure js/firebaseConfig.js is loaded correctly.");
                    return reject("firebaseConfig is not defined.");
                }
                try {
                    firebaseAppInstance = firebase.initializeApp(firebaseConfig);
                    console.log("Firebase initialized from auth.js.");
                } catch (error) {
                    console.error("Firebase initialization error from auth.js:", error);
                    return reject("Firebase initialization failed.");
                }
            } else {
                // If initialized elsewhere (e.g., directly in index.html's script tag), get the existing instance.
                firebaseAppInstance = firebase.app();
                console.log("Firebase already initialized, using existing instance in auth.js.");
            }
        } else {
            console.log("Firebase app instance already available in auth.js.");
        }

        // 3. Get the Auth service from the Firebase app instance.
        try {
            if (!firebaseAppInstance) {
                throw new Error("Firebase app instance is null, cannot get Auth service.");
            }
            auth = firebaseAppInstance.auth();
            console.log("Firebase Auth service obtained.");
            resolve(auth); // Resolve the promise with the auth service
        } catch (error) {
            console.error("Error obtaining Firebase Auth service:", error);
            reject("Failed to get Firebase Auth service.");
        }
    });
}

// Function to check authentication state. Relies on auth service being initialized.
// Returns a Promise that resolves with the user object (or null if not logged in).
function checkAuthState() {
    return new Promise((resolve, reject) => {
        // First, ensure the Auth service is initialized.
        if (!auth) {
            console.warn("Auth service not available yet. Attempting to initialize...");
            initializeFirebaseAndAuth()
                .then(() => {
                    // If initialization succeeds, auth should be available.
                    if (!auth) return reject("Auth service unavailable even after initialization.");

                    // Now, listen for auth state changes.
                    // onAuthStateChanged returns an unsubscribe function, which we call to clean up the listener.
                    const unsubscribe = auth.onAuthStateChanged(user => {
                        unsubscribe(); // Stop listening after the first state change
                        resolve(user); // Resolve the promise with the user object (null if not logged in)
                    }, (error) => {
                        // Handle any errors that occur during the state change listener
                        console.error("Error in onAuthStateChanged:", error);
                        reject(error);
                    });
                })
                .catch(reject); // Reject the promise if initialization fails
            return;
        }

        // If auth is already initialized, directly listen for auth state changes.
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe(); // Stop listening
            resolve(user);
        }, (error) => {
            console.error("Error in onAuthStateChanged (auth already init):", error);
            reject(error);
        });
    });
}

// --- Event Listeners for Forms and Buttons ---

// Login Form Submission
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessageDiv = document.getElementById('login-error-message');
        errorMessageDiv.textContent = ''; // Clear previous errors

        // Check if auth service is available before attempting login
        if (!auth) {
            errorMessageDiv.textContent = 'Authentication service unavailable. Please wait or refresh.';
            return;
        }

        try {
            // Attempt to sign in the user
            await auth.signInWithEmailAndPassword(email, password);
            // Redirection is handled by index.html's window.onload checkAuthState()
        } catch (error) {
            console.error("Login Error:", error);
            errorMessageDiv.textContent = error.message; // Display Firebase error message
        }
    });
}

// Register Form Submission
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const errorMessageDiv = document.getElementById('register-error-message');
        errorMessageDiv.textContent = '';

        if (!auth) {
            errorMessageDiv.textContent = 'Authentication service unavailable. Please wait or refresh.';
            return;
        }

        if (password !== confirmPassword) {
            errorMessageDiv.textContent = 'Passwords do not match.';
            return;
        }

        try {
            // Create a new user with email and password
            await auth.createUserWithEmailAndPassword(email, password);
            // Optionally send email verification after successful creation
            // await auth.currentUser.sendEmailVerification();
            alert('Registration successful! Please check your email to verify your account.');
            window.location.href = 'login.html'; // Redirect to login page
        } catch (error) {
            console.error("Registration Error:", error);
            errorMessageDiv.textContent = error.message;
        }
    });
}

// Password Reset Form Submission
const resetForm = document.getElementById('reset-form');
if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const errorMessageDiv = document.getElementById('reset-error-message');
        const successMessageDiv = document.getElementById('reset-message');
        errorMessageDiv.textContent = '';
        successMessageDiv.textContent = '';

        if (!auth) {
            errorMessageDiv.textContent = 'Authentication service unavailable.';
            return;
        }

        try {
            await auth.sendPasswordResetEmail(email);
            successMessageDiv.textContent = 'Password reset email sent! Check your inbox.';
        } catch (error) {
            console.error("Password Reset Error:", error);
            errorMessageDiv.textContent = error.message;
        }
    });
}

// Logout Button Listener
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        if (!auth) {
            alert("Authentication service unavailable.");
            return;
        }
        try {
            await auth.signOut();
            window.location.href = 'login.html'; // Redirect to login page
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed. Please try again.");
        }
    });
}

// Exporting key functions and variables if using ES Modules
// export { initializeFirebaseAndAuth, checkAuthState, auth, firebaseAppInstance };
