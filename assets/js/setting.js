document.addEventListener('DOMContentLoaded', () => {
    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.hyper-sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Settings Form Handling
    const profileForm = document.querySelector('.profile-form');
    const darkModeToggle = document.querySelector('.switch input');
    const languageSelect = document.querySelector('.setting-control');
    const logoutBtn = document.querySelector('.logout-btn');
    const deleteBtn = document.querySelector('.delete-btn');

    // Load saved settings
    loadSettings();

    profileForm.addEventListener('submit', saveProfile);
    darkModeToggle.addEventListener('change', toggleDarkMode);
    languageSelect.addEventListener('change', changeLanguage);
    logoutBtn.addEventListener('click', logoutUser);
    deleteBtn.addEventListener('click', deleteAccount);

    function loadSettings() {
        // Load from localStorage or default values
        const savedSettings = JSON.parse(localStorage.getItem('burmeSettings')) || {};
        
        if (savedSettings.username) {
            document.getElementById('username').value = savedSettings.username;
        }
        
        if (savedSettings.email) {
            document.getElementById('email').value = savedSettings.email;
        }
        
        if (savedSettings.language) {
            languageSelect.value = savedSettings.language;
        }
        
        if (savedSettings.darkMode) {
            darkModeToggle.checked = true;
            document.body.classList.add('dark-mode');
        }
    }

    function saveProfile(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        
        // Save to localStorage
        const currentSettings = JSON.parse(localStorage.getItem('burmeSettings')) || {};
        currentSettings.username = username;
        currentSettings.email = email;
        localStorage.setItem('burmeSettings', JSON.stringify(currentSettings));
        
        alert('ပရိုဖိုင်ပြောင်းလဲမှုများ သိမ်းဆည်းပြီးပါပြီ');
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        
        // Save preference
        const currentSettings = JSON.parse(localStorage.getItem('burmeSettings')) || {};
        currentSettings.darkMode = darkModeToggle.checked;
        localStorage.setItem('burmeSettings', JSON.stringify(currentSettings));
    }

    function changeLanguage() {
        const selectedLanguage = languageSelect.value;
        
        // Save preference
        const currentSettings = JSON.parse(localStorage.getItem('burmeSettings')) || {};
        currentSettings.language = selectedLanguage;
        localStorage.setItem('burmeSettings', JSON.stringify(currentSettings));
        
        alert('ဘာသာစကားပြောင်းလဲမှုအား အက်ပ်ကို ပြန်လည်စတင်မှသာ အပြည့်အဝအသုံးပြုနိုင်မည်');
    }

    function logoutUser() {
        if (confirm('သင့်အကောင့်မှ ထွက်ရန် သေချာပါသလား?')) {
            // Clear session and redirect
            localStorage.removeItem('burmeAuthToken');
            window.location.href = '../main.html';
        }
    }

    function deleteAccount() {
        if (confirm('သင့်အကောင့်အား အပြီးဖျက်ပစ်မည်ဖြစ်ပြီး ပြန်လည်ရယူ၍မရနိုင်တော့ပါ။ ဆက်လုပ်လိုပါသလား?')) {
            // Account deletion logic would go here
            alert('အကောင့်ဖျက်ခြင်း လုပ်ငန်းစဉ်ကို နောက်ဆုံးအဆင့်အတည်ပြုရန် သင့်အီးမေးလ်သို့ လင့်ခ်တစ်ခုပို့ပြီးဖြစ်သည်');
        }
    }
});
