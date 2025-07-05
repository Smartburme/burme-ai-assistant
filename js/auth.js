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

// Enhanced auth state checker with timeout
async function checkAuthState() {
    return new Promise((resolve) => {
        if (!authInitialized) {
            resolve(null);
            return;
        }

        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user || null);
        }, (error) => {
            console.error("Auth state error:", error);
            resolve(null);
        });

        // Add timeout (5 seconds)
        setTimeout(() => {
            unsubscribe();
            console.warn("Auth state check timed out");
            resolve(null);
        }, 5000);
    });
}

// Improved redirect logic for index.html
async function handleRedirects() {
    try {
        const user = await checkAuthState();
        const currentPage = window.location.pathname.split('/').pop();

        if (user) {
            // User is logged in - redirect from index to mainchat
            if (currentPage === 'index.html' || currentPage === '') {
                console.log("User authenticated, redirecting to mainchat");
                window.location.href = 'mainchat.html';
                return true;
            }
        } else {
            // User is not logged in - redirect from mainchat to index
            if (currentPage === 'mainchat.html') {
                console.log("User not authenticated, redirecting to index");
                window.location.href = 'index.html';
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error("Redirect error:", error);
        return false;
    }
}

// Enhanced login handler with immediate redirect
async function handleLogin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        if (userCredential.user) {
            console.log("Login successful, redirecting to mainchat");
            // Force reload to ensure all auth state is properly initialized
            window.location.href = 'mainchat.html?t=' + Date.now();
            return { success: true };
        }
        return { success: false, message: "Login failed - no user returned" };
    } catch (error) {
        console.error("Login error:", error);
        return { 
            success: false, 
            message: getFriendlyErrorMessage(error) 
        };
    }
}

// Setup login form in index.html
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
    
    // Set up login form if on index page
    if (window.location.pathname.endsWith('index.html') || 
        window.location.pathname === '/') {
        setupLoginForm();
    }
    
    // Check auth state and handle redirects
    const redirected = await handleRedirects();
    
    // If not redirected and on mainchat, verify auth
    if (!redirected && window.location.pathname.includes('mainchat.html')) {
        const user = await checkAuthState();
        if (!user) {
            window.location.href = 'index.html';
        }
    }
});
