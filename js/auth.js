// js/auth.js

let auth = null; // Initialize auth to null
let firebaseAppInstance = null; // To hold the Firebase app instance

// Function to ensure Firebase and Auth services are initialized
function initializeFirebaseAndAuth() {
    return new Promise((resolve, reject) => {
        // 1. Check if Firebase SDK scripts are loaded
        if (typeof firebase === 'undefined' || !firebase.initializeApp) {
            console.error("Firebase SDK scripts are not loaded or incomplete. Ensure scripts are correctly linked in HTML.");
            return reject("Firebase SDK not loaded.");
        }

        // 2. Check if firebaseApp is already initialized
        if (!firebaseAppInstance) {
            // If firebaseApp is not initialized yet, try to initialize it
            if (typeof firebase.apps === 'undefined' || firebase.apps.length === 0) {
                // Attempt to initialize if not already done
                if (typeof firebaseConfig === 'undefined') {
                    console.error("firebaseConfig is not defined. Ensure js/firebaseConfig.js is loaded correctly.");
                    return reject("firebaseConfig is not defined.");
                }
                try {
                    firebaseAppInstance = firebase.initializeApp(firebaseConfig);
                    console.log("Firebase initialized.");
                } catch (error) {
                    console.error("Firebase initialization error:", error);
                    return reject("Firebase initialization failed.");
                }
            } else {
                // Get existing instance if initialized elsewhere (e.g., by another script)
                firebaseAppInstance = firebase.app();
                console.log("Firebase already initialized, using existing instance.");
            }
        } else {
            console.log("Firebase app instance already available.");
        }

        // 3. Get the Auth service from the initialized app instance
        try {
            if (!firebaseAppInstance) {
                throw new Error("Firebase app instance is null.");
            }
            auth = firebaseAppInstance.auth();
            console.log("Firebase Auth service obtained.");
            resolve(auth); // Resolve with the auth service
        } catch (error) {
            console.error("Error obtaining Firebase Auth service:", error);
            reject("Failed to get Firebase Auth service.");
        }
    });
}

// Function to check auth state (relies on auth service being initialized)
function checkAuthState() {
    return new Promise((resolve, reject) => {
        // Ensure auth service is available before proceeding
        if (!auth) {
            console.warn("Auth service not available yet. Attempting to initialize...");
            initializeFirebaseAndAuth()
                .then(() => {
                    // After initialization, auth should be available
                    if (!auth) return reject("Auth service unavailable after initialization.");
                    // Now, listen for auth state changes
                    const unsubscribe = auth.onAuthStateChanged(user => {
                        unsubscribe(); // Stop listening once state is captured
                        resolve(user);
                    }, (error) => {
                        console.error("Error in onAuthStateChanged:", error);
                        reject(error);
                    });
                })
                .catch(reject); // Catch errors from initializeFirebaseAndAuth
            return;
        }

        // If auth is already initialized, directly listen for state changes
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, (error) => {
            console.error("Error in onAuthStateChanged:", error);
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
        errorMessageDiv.textContent = '';

        if (!auth) {
            errorMessageDiv.textContent = 'Authentication service unavailable. Please wait or refresh.';
            return;
        }

        try {
            await auth.signInWithEmailAndPassword(email, password);
            // Redirection is handled by index.html's checkAuthState on page load
        } catch (error) {
            console.error("Login Error:", error);
            errorMessageDiv.textContent = error.message;
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
            await auth.createUserWithEmailAndPassword(email, password);
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

// Ensure initializeFirebaseAndAuth is callable by index.html if needed
// If using modules, you would export it. Otherwise, it's globally available.
// export { initializeFirebaseAndAuth, checkAuthState, auth, firebaseAppInstance };
