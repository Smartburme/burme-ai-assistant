let auth = null; let firebaseAppInstance = null;

// Initialize Firebase and Auth service function initializeFirebaseAndAuth() { return new Promise((resolve, reject) => { if (typeof firebase === "undefined" || !firebase.initializeApp) { console.error("Firebase SDK is not loaded."); return reject("Firebase SDK not loaded."); }

if (!firebaseAppInstance) {
  if (typeof firebase.apps === "undefined" || firebase.apps.length === 0) {
    if (typeof firebaseConfig === "undefined") {
      console.error("firebaseConfig is not defined.");
      return reject("firebaseConfig is not defined.");
    }
    try {
      firebaseAppInstance = firebase.initializeApp(firebaseConfig);
      console.log("Firebase initialized in auth.js.");
    } catch (error) {
      console.error("Firebase initialization error in auth.js:", error);
      return reject("Firebase initialization failed.");
    }
  } else {
    firebaseAppInstance = firebase.app();
    console.log("Using existing Firebase app instance in auth.js.");
  }
} else {
  console.log("Firebase app instance already available in auth.js.");
}

try {
  auth = firebaseAppInstance.auth();
  console.log("Firebase Auth service obtained.");
  resolve(auth);
} catch (error) {
  console.error("Error obtaining Firebase Auth service:", error);
  reject("Failed to get Firebase Auth service.");
}

}); }

// Check Auth State function checkAuthState() { return new Promise((resolve, reject) => { if (!auth) { console.warn("Auth service not available yet. Initializing..."); initializeFirebaseAndAuth() .then(() => { if (!auth) return reject("Auth service unavailable even after initialization."); const unsubscribe = auth.onAuthStateChanged( (user) => { unsubscribe(); resolve(user); }, (error) => { console.error("Error in onAuthStateChanged:", error); reject(error); } ); }) .catch(reject); return; }

const unsubscribe = auth.onAuthStateChanged(
  (user) => {
    unsubscribe();
    resolve(user);
  },
  (error) => {
    console.error("Error in onAuthStateChanged:", error);
    reject(error);
  }
);

}); }

// Login Event Listener const loginForm = document.getElementById("login-form"); if (loginForm) { loginForm.addEventListener("submit", async (e) => { e.preventDefault(); const email = document.getElementById("email").value.trim(); const password = document.getElementById("password").value; const errorMessageDiv = document.getElementById("login-error-message"); errorMessageDiv.textContent = "";

if (!auth) {
  errorMessageDiv.textContent = "Authentication service unavailable. Please wait or refresh.";
  return;
}

try {
  await auth.signInWithEmailAndPassword(email, password);
  window.location.href = "mainchat.html";
} catch (error) {
  console.error("Login Error:", error);
  switch (error.code) {
    case "auth/invalid-email":
      errorMessageDiv.textContent = "Email ပုံစံမှားနေပါသည်။";
      break;
    case "auth/user-not-found":
      errorMessageDiv.textContent = "ဤ Email နှင့် မတွေ့ရှိပါ။";
      break;
    case "auth/wrong-password":
      errorMessageDiv.textContent = "Password မှားနေပါသည်။";
      break;
    case "auth/too-many-requests":
      errorMessageDiv.textContent = "Login လုပ်မှုအရမ်းများနေသည်။ ခဏစောင့်ပါ။";
      break;
    default:
      errorMessageDiv.textContent = "Login မအောင်မြင်ပါ။ ပြန်စစ်ပေးပါ။";
  }
}

}); }

// Register Event Listener const registerForm = document.getElementById("register-form"); if (registerForm) { registerForm.addEventListener("submit", async (e) => { e.preventDefault(); const email = document.getElementById("email").value.trim(); const password = document.getElementById("password").value; const confirmPassword = document.getElementById("confirm-password").value; const errorMessageDiv = document.getElementById("register-error-message"); errorMessageDiv.textContent = "";

if (!auth) {
  errorMessageDiv.textContent = "Authentication service unavailable. Please wait or refresh.";
  return;
}

if (password !== confirmPassword) {
  errorMessageDiv.textContent = "Passwords do not match.";
  return;
}

try {
  await auth.createUserWithEmailAndPassword(email, password);
  alert("Registration successful! Please check your email to verify your account.");
  window.location.href = "login.html";
} catch (error) {
  console.error("Registration Error:", error);
  errorMessageDiv.textContent = error.message;
}

}); }

// Password Reset Event Listener const resetForm = document.getElementById("reset-form"); if (resetForm) { resetForm.addEventListener("submit", async (e) => { e.preventDefault(); const email = document.getElementById("email").value.trim(); const errorMessageDiv = document.getElementById("reset-error-message"); const successMessageDiv = document.getElementById("reset-message"); errorMessageDiv.textContent = ""; successMessageDiv.textContent = "";

if (!auth) {
  errorMessageDiv.textContent = "Authentication service unavailable.";
  return;
}

try {
  await auth.sendPasswordResetEmail(email);
  successMessageDiv.textContent = "Password reset email sent! Check your inbox.";
} catch (error) {
  console.error("Password Reset Error:", error);
  errorMessageDiv.textContent = error.message;
}

}); }

// Logout Button Listener const logoutBtn = document.getElementById("logout-btn"); if (logoutBtn) { logoutBtn.addEventListener("click", async (e) => { e.preventDefault(); if (!auth) { alert("Authentication service unavailable."); return; } try { await auth.signOut(); window.location.href = "login.html"; } catch (error) { console.error("Logout Error:", error); alert("Logout failed. Please try again."); } }); }

