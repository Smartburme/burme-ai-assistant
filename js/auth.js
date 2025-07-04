// js/auth.js

let auth = null;
let authInitialized = false;

// Initialize Firebase Auth with persistence
async function initializeAuth() {
    try {
        if (typeof firebase === 'undefined' || !firebase.auth) {
            throw new Error("Firebase SDK not loaded properly");
        }

        auth = firebase.auth();
        
        // Set persistence to LOCAL to maintain session
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        
        authInitialized = true;
        console.log("Firebase Auth initialized successfully with LOCAL persistence");
        return true;
    } catch (error) {
        console.error("Firebase Auth initialization failed:", error);
        showGlobalError("Authentication service failed to initialize. Please refresh the page.");
        return false;
    }
}

// Check auth state and handle redirects
async function checkAuthAndRedirect() {
    if (!authInitialized) {
        await initializeAuth();
    }

    try {
        const user = await new Promise((resolve, reject) => {
            const unsubscribe = auth.onAuthStateChanged(user => {
                unsubscribe();
                resolve(user);
            }, error => {
                console.error("Auth state error:", error);
                reject(error);
            });
        });

        const currentPage = window.location.pathname.split('/').pop();

        if (user) {
            // User is logged in - redirect from login/register to mainchat
            if (currentPage === 'login.html' || currentPage === 'register.html') {
                console.log("Redirecting to mainchat.html");
                window.location.href = 'mainchat.html';
            }
        } else {
            // User is not logged in - redirect from mainchat to login
            if (currentPage === 'mainchat.html') {
                console.log("Redirecting to login.html");
                window.location.href = 'login.html';
            }
        }

        return user;
    } catch (error) {
        console.error("Error checking auth state:", error);
        return null;
    }
}

// Enhanced login handler with immediate redirect
async function handleLogin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        if (userCredential.user) {
            console.log("Login successful, redirecting to mainchat");
            window.location.href = 'mainchat.html';
            return { success: true };
        }
    } catch (error) {
        console.error("Login error:", error);
        return { 
            success: false, 
            message: getFriendlyErrorMessage(error) 
        };
    }
}

// Setup login form with proper redirect
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = loginForm.querySelector('#email').value.trim();
        const password = loginForm.querySelector('#password').value.trim();
        const errorElement = loginForm.querySelector('#login-error-message');
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        // Clear errors and set loading state
        errorElement.textContent = '';
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> လုပ်ဆောင်နေသည်...';

        const result = await handleLogin(email, password);
        
        if (!result.success) {
            errorElement.textContent = result.message;
            submitBtn.disabled = false;
            submitBtn.textContent = 'ဝင်ရောက်ရန်';
        }
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await initializeAuth();
    setupLoginForm();
    
    // Check auth state and handle redirects
    await checkAuthAndRedirect();
});

// Keep other existing functions (register, reset, logout) as they were
