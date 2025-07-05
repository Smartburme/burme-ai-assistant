// js/auth.js

let auth = null;
let firebaseAppInstance = null;

// Initialize Firebase Auth only using existing firebaseApp
function initializeFirebaseAndAuth() {
    return new Promise((resolve, reject) => {
        if (typeof firebase === 'undefined') {
            return reject("Firebase SDK not loaded.");
        }

        try {
            firebaseAppInstance = firebase.app(); // ✅ get already initialized app
            auth = firebaseAppInstance.auth();
            console.log("✅ Firebase Auth service obtained.");
            resolve(auth);
        } catch (error) {
            console.error("❌ Error getting Auth service:", error);
            reject("Failed to get Firebase Auth service.");
        }
    });
}

// Check Auth State
function checkAuthState() {
    return new Promise((resolve, reject) => {
        if (!auth) {
            initializeFirebaseAndAuth()
                .then(() => {
                    const unsubscribe = auth.onAuthStateChanged(user => {
                        unsubscribe();
                        resolve(user);
                    }, reject);
                })
                .catch(reject);
        } else {
            const unsubscribe = auth.onAuthStateChanged(user => {
                unsubscribe();
                resolve(user);
            }, reject);
        }
    });
}

// --- Event Listeners ---

// Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error-message');
        errorDiv.textContent = '';

        if (!auth) {
            errorDiv.textContent = 'Authentication not ready.';
            return;
        }

        try {
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            errorDiv.textContent = error.message;
        }
    });
}

// Register
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const errorDiv = document.getElementById('register-error-message');
        errorDiv.textContent = '';

        if (!auth) {
            errorDiv.textContent = 'Authentication not ready.';
            return;
        }

        if (password !== confirmPassword) {
            errorDiv.textContent = 'Passwords do not match.';
            return;
        }

        try {
            await auth.createUserWithEmailAndPassword(email, password);
            alert('Registered successfully!');
            window.location.href = 'login.html';
        } catch (error) {
            errorDiv.textContent = error.message;
        }
    });
}

// Reset Password
const resetForm = document.getElementById('reset-form');
if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const errorDiv = document.getElementById('reset-error-message');
        const successDiv = document.getElementById('reset-message');
        errorDiv.textContent = '';
        successDiv.textContent = '';

        if (!auth) {
            errorDiv.textContent = 'Authentication not ready.';
            return;
        }

        try {
            await auth.sendPasswordResetEmail(email);
            successDiv.textContent = 'Reset email sent!';
        } catch (error) {
            errorDiv.textContent = error.message;
        }
    });
}

// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        if (!auth) return alert("Auth not available.");

        try {
            await auth.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            alert("Logout failed.");
        }
    });
        }
