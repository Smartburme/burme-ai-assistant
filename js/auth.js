// js/auth.js

let auth = null;
let authInitialized = false;

// Initialize Firebase Auth
async function initializeAuth() {
    try {
        if (typeof firebase === 'undefined' || !firebase.auth) {
            throw new Error("Firebase SDK not loaded");
        }

        auth = firebase.auth();
        
        // Set persistence to LOCAL to maintain login state
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        
        authInitialized = true;
        console.log("Firebase Auth initialized with LOCAL persistence");
        return true;
    } catch (error) {
        console.error("Auth initialization failed:", error);
        showGlobalError("Authentication service failed to initialize");
        return false;
    }
}

// Check auth state with redirect logic
async function checkAuthAndRedirect() {
    if (!authInitialized) {
        await initializeAuth();
    }

    try {
        const user = await new Promise((resolve, reject) => {
            const unsubscribe = auth.onAuthStateChanged(user => {
                unsubscribe();
                resolve(user);
            }, reject);
        });

        const currentPage = window.location.pathname.split('/').pop();

        if (user) {
            // User is logged in
            if (currentPage === 'login.html' || currentPage === 'register.html') {
                console.log("User is logged in, redirecting to mainchat");
                window.location.href = 'mainchat.html';
            }
        } else {
            // User is not logged in
            if (currentPage === 'mainchat.html') {
                console.log("User is not logged in, redirecting to login");
                window.location.href = 'login.html';
            }
        }

        return user;
    } catch (error) {
        console.error("Auth state check error:", error);
        return null;
    }
}

// Enhanced login function
async function handleLogin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        if (userCredential.user) {
            console.log("Login successful, user:", userCredential.user.email);
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

// Setup login form
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = loginForm.querySelector('#email').value.trim();
        const password = loginForm.querySelector('#password').value.trim();
        const errorElement = loginForm.querySelector('#login-error-message');
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        // UI feedback
        errorElement.textContent = '';
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> လုပ်ဆောင်နေသည်...';

        const result = await handleLogin(email, password);
        
        if (result.success) {
            // Redirect after successful login
            window.location.href = 'mainchat.html';
        } else {
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

// Keep other existing functions (logout, register, etc.)
