// js/auth.js

let auth; // Initialize auth variable outside functions
let firebaseAppInstance; // To hold the Firebase app instance

// Function to initialize Firebase and get Auth service
function initializeAuth() {
    return new Promise((resolve, reject) => {
        // Check if firebaseApp is available (initialized in firebaseConfig.js)
        if (typeof firebase === 'undefined' || typeof firebase.apps === 'undefined' || firebase.apps.length === 0) {
            console.error("Firebase SDK is not loaded or initialized. Ensure firebaseConfig.js and SDK scripts are loaded correctly.");
            return reject("Firebase SDK not loaded.");
        }

        try {
            firebaseAppInstance = firebase.app(); // Get the initialized app instance
            auth = firebaseAppInstance.auth();
            console.log("Firebase Auth service obtained.");
            resolve(auth);
        } catch (error) {
            console.error("Error initializing Firebase Auth:", error);
            reject(error);
        }
    });
}

// Function to check auth state and return a Promise
function checkAuthState() {
    return new Promise((resolve, reject) => {
        // Ensure auth is initialized before proceeding
        if (!auth) {
            console.error("Firebase Auth service is not initialized yet.");
            // Optionally try to initialize it here, or reject the promise
            initializeAuth().then(() => {
                if (!auth) return reject("Firebase Auth service failed to initialize.");
                // After initialization, listen for auth state changes
                const unsubscribe = auth.onAuthStateChanged(user => {
                    unsubscribe(); // Stop listening
                    resolve(user);
                }, (error) => {
                    console.error("Error in onAuthStateChanged:", error);
                    reject(error);
                });
            }).catch(reject); // Catch initialization errors
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
        errorMessageDiv.textContent = ''; // Clear previous errors

        if (!auth) {
            errorMessageDiv.textContent = 'Authentication service unavailable.';
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
            errorMessageDiv.textContent = 'Authentication service unavailable.';
            return;
        }

        if (password !== confirmPassword) {
            errorMessageDiv.textContent = 'Passwords do not match.';
            return;
        }

        try {
            await auth.createUserWithEmailAndPassword(email, password);
            // Optionally send email verification
            // await auth.currentUser.sendEmailVerification();
            alert('Registration successful! Please check your email to verify your account.');
            window.location.href = 'login.html'; // Redirect to login page after successful registration
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

// Exporting checkAuthState for index.html to use.
// Ensure that firebaseConfig.js is loaded and initializes firebaseApp before this is called.
// Exporting auth instance for other modules if needed.
// export { checkAuthState, auth, firebaseAppInstance }; // Uncomment if using modules
