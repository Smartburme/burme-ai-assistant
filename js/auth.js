// js/auth.js

let auth;
try {
    if (firebaseApp) { // Ensure firebaseApp is initialized before accessing auth
        auth = firebaseApp.auth();
    } else {
        throw new Error("Firebase Auth service not available. Ensure firebaseConfig.js is loaded correctly.");
    }
} catch (error) {
    console.error("Error accessing Firebase Auth:", error);
}

// Function to check auth state and return a Promise
function checkAuthState() {
    return new Promise((resolve, reject) => {
        if (!auth) {
            return reject("Firebase Auth is not initialized or accessible.");
        }
        // onAuthStateChanged returns an unsubscribe function
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe(); // Stop listening after the first state change
            resolve(user);
        }, (error) => { // Handle errors during auth state check
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
            // If successful, index.html's window.onload will handle redirection
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

// Exporting checkAuthState for index.html to use.
// If you are not using modules, this function is globally available.
// export { checkAuthState };