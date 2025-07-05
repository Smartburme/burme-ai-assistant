// js/auth.js

let auth = null;
let firebaseAppInstance = null;

function initializeFirebaseAndAuth() {
    return new Promise((resolve, reject) => {
        if (typeof firebase === 'undefined' || !firebase.initializeApp) {
            console.error("Firebase SDK scripts are not loaded or incomplete. Ensure scripts are correctly linked in HTML.");
            return reject("Firebase SDK not loaded.");
        }

        if (!firebaseAppInstance) {
            if (typeof firebase.apps === 'undefined' || firebase.apps.length === 0) {
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
                firebaseAppInstance = firebase.app();
                console.log("Firebase already initialized, using existing instance in auth.js.");
            }
        } else {
            console.log("Firebase app instance already available in auth.js.");
        }

        try {
            if (!firebaseAppInstance) throw new Error("Firebase app instance is null, cannot get Auth service.");
            auth = firebaseAppInstance.auth();
            console.log("Firebase Auth service obtained.");
            resolve(auth);
        } catch (error) {
            console.error("Error obtaining Firebase Auth service:", error);
            reject("Failed to get Firebase Auth service.");
        }
    });
}

function checkAuthState() {
    return new Promise((resolve, reject) => {
        if (!auth) {
            console.warn("Auth service not available yet. Attempting to initialize...");
            initializeFirebaseAndAuth()
                .then(() => {
                    if (!auth) return reject("Auth service unavailable even after initialization.");
                    const unsubscribe = auth.onAuthStateChanged(user => {
                        unsubscribe();
                        resolve(user);
                    }, (error) => {
                        console.error("Error in onAuthStateChanged:", error);
                        reject(error);
                    });
                })
                .catch(reject);
            return;
        }

        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, (error) => {
            console.error("Error in onAuthStateChanged (auth already init):", error);
            reject(error);
        });
    });
}

// Login Form Submission
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMessageDiv = document.getElementById('login-error-message');
        errorMessageDiv.textContent = '';

        try {
            if (!auth) await initializeFirebaseAndAuth();
            await auth.signInWithEmailAndPassword(email, password);
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

        if (password !== confirmPassword) {
            errorMessageDiv.textContent = 'Passwords do not match.';
            return;
        }

        try {
            if (!auth) await initializeFirebaseAndAuth();
            await auth.createUserWithEmailAndPassword(email, password);
            alert('Registration successful! Please check your email to verify your account.');
            window.location.href = 'login.html';
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

        try {
            if (!auth) await initializeFirebaseAndAuth();
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
        try {
            if (!auth) await initializeFirebaseAndAuth();
            await auth.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            console.error("Logout Error:", error);
            alert("Logout failed. Please try again.");
        }
    });
}

// Export if needed
// export { initializeFirebaseAndAuth, checkAuthState, auth, firebaseAppInstance };
