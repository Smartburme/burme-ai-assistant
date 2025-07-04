// js/auth.js

// Firebase Auth Service Initialization
let auth;

function initializeFirebaseAuth() {
    try {
        // Check if Firebase app is already initialized
        if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            auth = firebase.auth();
            console.log("Firebase Auth initialized successfully");
            return true;
        } else {
            throw new Error("Firebase app not initialized");
        }
    } catch (error) {
        console.error("Firebase Auth initialization failed:", error);
        showGlobalError("Authentication service initialization failed. Please refresh the page.");
        return false;
    }
}

// Initialize auth when script loads
if (!initializeFirebaseAuth()) {
    console.error("Failed to initialize Firebase Auth");
}

// User-friendly error messages in Burmese
function getFriendlyErrorMessage(error) {
    switch(error.code) {
        case 'auth/invalid-email':
            return 'ကျေးဇူးပြု၍ မှန်ကန်သော အီးမေးလ်လိပ်စာထည့်ပါ';
        case 'auth/user-disabled':
            return 'ဤအကောင့်ကို ယာယီပိတ်ထားပါသည်';
        case 'auth/user-not-found':
            return 'ဤအီးမေးလ်ဖြင့် အကောင့်မရှိပါ';
        case 'auth/wrong-password':
            return 'လျှို့ဝှက်နံပါတ်မှားနေပါသည်';
        case 'auth/too-many-requests':
            return 'အကောင့်ကို ယာယီပိတ်ထားပါသည်။ နောက်မှပြန်ကြိုးစားပါ';
        case 'auth/network-request-failed':
            return 'အင်တာနက်ချိတ်ဆက်မှု ပြဿနာရှိပါသည်';
        default:
            return 'အမှားတစ်ခုဖြစ်နေပါသည်: ' + error.message;
    }
}

// Show error message to user
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Show global error message
function showGlobalError(message) {
    const globalError = document.getElementById('global-error');
    if (globalError) {
        globalError.textContent = message;
        globalError.style.display = 'block';
    }
}

// Check authentication state
function checkAuthState() {
    return new Promise((resolve, reject) => {
        if (!auth) {
            console.error("Auth not initialized");
            return reject("Authentication service not available");
        }

        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            if (user) {
                console.log("User is logged in:", user.email);
                resolve(user);
            } else {
                console.log("No user logged in");
                resolve(null);
            }
        }, error => {
            console.error("Auth state error:", error);
            reject(error);
        });
    });
}

// Login Form Handler
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorElement = document.getElementById('login-error-message');
            
            // Clear previous errors
            if (errorElement) errorElement.textContent = '';

            // Basic validation
            if (!email || !password) {
                showError('login-error-message', 'ကျေးဇူးပြု၍ အီးမေးလ်နှင့် လျှို့ဝှက်နံပါတ်ထည့်ပါ');
                return;
            }

            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                if (userCredential.user) {
                    console.log("Login successful, redirecting...");
                    window.location.href = 'mainchat.html';
                }
            } catch (error) {
                console.error("Login Error:", error);
                showError('login-error-message', getFriendlyErrorMessage(error));
            }
        });
    }
}

// Registration Form Handler
function setupRegistrationForm() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirm-password').value.trim();
            const errorElement = document.getElementById('register-error-message');
            
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

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                if (userCredential.user) {
                    alert('အကောင့်အောင်မြင်စွာဖန်တီးပြီးပါပြီ။ ကျေးဇူးပြု၍ ဝင်ရောက်ပါ');
                    window.location.href = 'login.html';
                }
            } catch (error) {
                console.error("Registration Error:", error);
                showError('register-error-message', getFriendlyErrorMessage(error));
            }
        });
    }
}

// Password Reset Handler
function setupPasswordReset() {
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const errorElement = document.getElementById('reset-error-message');
            const successElement = document.getElementById('reset-success-message');
            
            if (errorElement) errorElement.textContent = '';
            if (successElement) successElement.textContent = '';

            if (!email) {
                showError('reset-error-message', 'ကျေးဇူးပြု၍ အီးမေးလ်လိပ်စာထည့်ပါ');
                return;
            }

            try {
                await auth.sendPasswordResetEmail(email);
                if (successElement) {
                    successElement.textContent = 'လျှို့ဝှက်နံပါတ်ပြန်လည်သတ်မှတ်ရန် လင့်ခ်ကို အီးမေးလ်ပို့ပြီးပါပြီ';
                    successElement.style.display = 'block';
                }
            } catch (error) {
                console.error("Password Reset Error:", error);
                showError('reset-error-message', getFriendlyErrorMessage(error));
            }
        });
    }
}

// Logout Handler
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await auth.signOut();
                window.location.href = 'login.html';
            } catch (error) {
                console.error("Logout Error:", error);
                alert("အကောင့်မှ ထွက်ရာတွင် အမှားတစ်ခုဖြစ်နေပါသည်");
            }
        });
    }
}

// Initialize all handlers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupLoginForm();
    setupRegistrationForm();
    setupPasswordReset();
    setupLogout();
    
    // Check auth state for redirection
    checkAuthState().then(user => {
        if (user && (window.location.pathname.includes('login.html') || 
                     window.location.pathname.includes('register.html'))) {
            window.location.href = 'mainchat.html';
        }
    }).catch(error => {
        console.error("Auth state check failed:", error);
    });
});
