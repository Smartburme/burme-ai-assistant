// js/auth.js

// Firebase Auth Service Initialization
let auth = null;
let authInitialized = false;

// Improved Firebase initialization with retry logic
function initializeFirebaseAuth() {
    return new Promise((resolve, reject) => {
        const maxAttempts = 5;
        let attempts = 0;

        const tryInitialize = () => {
            attempts++;
            try {
                if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                    auth = firebase.auth();
                    authInitialized = true;
                    console.log("Firebase Auth initialized successfully");
                    resolve(true);
                } else if (attempts < maxAttempts) {
                    console.log(`Firebase not ready yet, retrying... (${attempts}/${maxAttempts})`);
                    setTimeout(tryInitialize, 300);
                } else {
                    throw new Error("Firebase app not initialized after multiple attempts");
                }
            } catch (error) {
                console.error("Firebase Auth initialization failed:", error);
                if (attempts < maxAttempts) {
                    setTimeout(tryInitialize, 300);
                } else {
                    showGlobalError("Authentication service initialization failed. Please refresh the page.");
                    reject(false);
                }
            }
        };

        tryInitialize();
    });
}

// Initialize auth when script loads
initializeFirebaseAuth().catch(() => {
    console.error("Failed to initialize Firebase Auth");
});

// Enhanced user-friendly error messages in Burmese
function getFriendlyErrorMessage(error) {
    const errorMap = {
        'auth/invalid-email': 'ကျေးဇူးပြု၍ မှန်ကန်သော အီးမေးလ်လိပ်စာထည့်ပါ',
        'auth/user-disabled': 'ဤအကောင့်ကို ယာယီပိတ်ထားပါသည်',
        'auth/user-not-found': 'ဤအီးမေးလ်ဖြင့် အကောင့်မရှိပါ',
        'auth/wrong-password': 'လျှို့ဝှက်နံပါတ်မှားနေပါသည်',
        'auth/too-many-requests': 'အကောင့်ကို ယာယီပိတ်ထားပါသည်။ နောက်မှပြန်ကြိုးစားပါ',
        'auth/network-request-failed': 'အင်တာနက်ချိတ်ဆက်မှု ပြဿနာရှိပါသည်',
        'auth/email-already-in-use': 'ဤအီးမေးလ်ဖြင့် အကောင့်ရှိပြီးသားဖြစ်ပါသည်',
        'auth/weak-password': 'လျှို့ဝှက်နံပါတ်သည် အလွန်အားနည်းနေပါသည်'
    };

    return errorMap[error.code] || `အမှားတစ်ခုဖြစ်နေပါသည်: ${error.message}`;
}

// Show error message to user
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}

// Show global error message
function showGlobalError(message) {
    const globalError = document.getElementById('global-error') || createGlobalErrorElement();
    globalError.textContent = message;
    globalError.style.display = 'block';
}

function createGlobalErrorElement() {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'global-error';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 15px;
        background-color: #ff4444;
        color: white;
        border-radius: 5px;
        z-index: 1000;
        display: none;
    `;
    document.body.appendChild(errorDiv);
    return errorDiv;
}

// Enhanced authentication state check with timeout
function checkAuthState() {
    return new Promise((resolve, reject) => {
        if (!authInitialized) {
            return reject("Authentication service not initialized");
        }

        const timeout = setTimeout(() => {
            reject("Authentication check timed out");
        }, 5000);

        const unsubscribe = auth.onAuthStateChanged(user => {
            clearTimeout(timeout);
            unsubscribe();
            resolve(user);
        }, error => {
            clearTimeout(timeout);
            unsubscribe();
            reject(error);
        });
    });
}

// Enhanced login handler with loading state
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginForm.querySelector('#email').value.trim();
        const password = loginForm.querySelector('#password').value.trim();
        const errorElement = loginForm.querySelector('#login-error-message');
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        // Clear previous errors
        if (errorElement) errorElement.textContent = '';

        // Basic validation
        if (!email || !password) {
            showError('login-error-message', 'ကျေးဇူးပြု၍ အီးမေးလ်နှင့် လျှို့ဝှက်နံပါတ်ထည့်ပါ');
            return;
        }

        // Set loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'လုပ်ဆောင်နေသည်...';

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            if (userCredential.user) {
                console.log("Login successful, redirecting...");
                window.location.href = 'mainchat.html';
            }
        } catch (error) {
            console.error("Login Error:", error);
            showError('login-error-message', getFriendlyErrorMessage(error));
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// Enhanced registration handler
function setupRegistrationForm() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = registerForm.querySelector('#email').value.trim();
        const password = registerForm.querySelector('#password').value.trim();
        const confirmPassword = registerForm.querySelector('#confirm-password').value.trim();
        const errorElement = registerForm.querySelector('#register-error-message');
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;

        if (errorElement) errorElement.textContent = '';

        // Validation
        if (!email || !password || !confirmPassword) {
            showError('register-error-message', 'ကျေးဇူးပြု၍ အကုန်လုံးဖြည့်ပါ');
            return;
        }

        if (password !== confirmPassword) {
            showError('register-error-message', 'လျှို့ဝှက်နံပါတ်နှစ်ခု တူညီရပါမည်');
            return;
        }

        if (password.length < 6) {
            showError('register-error-message', 'လျှို့ဝှက်နံပါတ်သည် အနည်းဆုံး ၆ လုံးရှိရပါမည်');
            return;
        }

        // Set loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'လုပ်ဆောင်နေသည်...';

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            if (userCredential.user) {
                // Send email verification
                await userCredential.user.sendEmailVerification();
                alert('အကောင့်အောင်မြင်စွာဖန်တီးပြီးပါပြီ။ ကျေးဇူးပြု၍ အီးမေးလ်အတည်ပြုပါ');
                window.location.href = 'login.html';
            }
        } catch (error) {
            console.error("Registration Error:", error);
            showError('register-error-message', getFriendlyErrorMessage(error));
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });
}

// Initialize all handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for auth to initialize before setting up forms
    const initAuth = async () => {
        try {
            await initializeFirebaseAuth();
            
            setupLoginForm();
            setupRegistrationForm();
            setupPasswordReset();
            setupLogout();
            
            // Check auth state for redirection
            const user = await checkAuthState();
            if (user && (window.location.pathname.includes('login.html') || 
                         window.location.pathname.includes('register.html'))) {
                window.location.href = 'mainchat.html';
            }
        } catch (error) {
            console.error("Initialization error:", error);
            // If on mainchat page and not authenticated, redirect to login
            if (window.location.pathname.includes('mainchat.html')) {
                window.location.href = 'login.html';
            }
        }
    };

    initAuth();
});
