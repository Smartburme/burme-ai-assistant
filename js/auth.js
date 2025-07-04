// js/auth.js

let auth = null;
let authInitialized = false;

// Initialize Firebase Auth with better error handling
function initializeAuth() {
    return new Promise((resolve, reject) => {
        try {
            // Check if Firebase is available
            if (typeof firebase === 'undefined' || !firebase.auth) {
                throw new Error("Firebase SDK not loaded properly");
            }

            auth = firebase.auth();
            authInitialized = true;
            console.log("Firebase Auth initialized successfully");
            resolve(true);
        } catch (error) {
            console.error("Firebase Auth initialization failed:", error);
            showGlobalError("Authentication service failed to initialize. Please refresh the page.");
            reject(false);
        }
    });
}

// Enhanced auth state checker
async function checkAuthState() {
    if (!authInitialized) {
        await initializeAuth();
    }

    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, error => {
            console.error("Auth state error:", error);
            reject(error);
        });
    });
}

// Improved login handler with redirect
async function handleLogin(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        
        // Check if email is verified (optional)
        if (userCredential.user && userCredential.user.emailVerified) {
            return { success: true, user: userCredential.user };
        } else if (userCredential.user) {
            // If you require email verification
            // await userCredential.user.sendEmailVerification();
            // return { success: false, message: "Please verify your email first" };
            return { success: true, user: userCredential.user };
        }
    } catch (error) {
        console.error("Login error:", error);
        return { 
            success: false, 
            message: getFriendlyErrorMessage(error),
            error: error 
        };
    }
}

// Burmese error messages
function getFriendlyErrorMessage(error) {
    const errorMap = {
        'auth/invalid-email': 'အီးမေးလ်လိပ်စာမှားနေပါသည်',
        'auth/user-disabled': 'ဤအကောင့်ကိုပိတ်ထားပါသည်',
        'auth/user-not-found': 'ဤအီးမေးလ်နှင့်အကောင့်မရှိပါ',
        'auth/wrong-password': 'လျှို့ဝှက်နံပါတ်မှားနေပါသည်',
        'auth/too-many-requests': 'အကြိမ်အရေတွက်များနေပါသည်၊ နောက်မှကြိုးစားပါ',
        'auth/network-request-failed': 'အင်တာနက်ချိတ်ဆက်မှုပြဿနာရှိပါသည်'
    };

    return errorMap[error.code] || error.message;
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
        
        if (result.success) {
            // Successful login - redirect to mainchat
            window.location.href = 'mainchat.html';
        } else {
            // Show error message
            errorElement.textContent = result.message;
            submitBtn.disabled = false;
            submitBtn.textContent = 'ဝင်ရောက်ရန်';
        }
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await initializeAuth();
        
        // Setup all auth related forms
        setupLoginForm();
        
        // Check current auth state
        const user = await checkAuthState();
        
        // Redirect logic:
        if (user) {
            // If user is logged in and on login/register page, redirect to mainchat
            if (window.location.pathname.includes('login.html') || 
                window.location.pathname.includes('register.html')) {
                window.location.href = 'mainchat.html';
            }
        } else {
            // If user is not logged in and on mainchat, redirect to login
            if (window.location.pathname.includes('mainchat.html')) {
                window.location.href = 'login.html';
            }
        }
    } catch (error) {
        console.error("Initialization error:", error);
    }
});

// Keep other form handlers (register, reset, logout) as they were
// [Previous code for register, reset and logout handlers]
