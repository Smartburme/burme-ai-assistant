// BURME AI - Settings Module
class SettingsManager {
  constructor() {
    // DOM Elements
    this.themeOptions = document.querySelectorAll('.theme-option');
    this.fontSizeSelect = document.getElementById('fontSize');
    this.languageSelect = document.getElementById('languageSelect');
    this.userNameInput = document.getElementById('userName');
    this.userEmailInput = document.getElementById('userEmail');
    this.userAvatarInput = document.getElementById('userAvatar');
    this.avatarPreview = document.getElementById('avatarPreview');
    this.saveProfileBtn = document.querySelector('.save-btn');
    this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
    this.deleteAccountBtn = document.getElementById('deleteAccountBtn');
    this.currentPasswordInput = document.getElementById('currentPassword');
    this.newPasswordInput = document.getElementById('newPassword');
    this.confirmPasswordInput = document.getElementById('confirmPassword');
    this.changePasswordBtn = document.querySelector('.save-btn');

    this.initEventListeners();
    this.loadUserSettings();
  }

  initEventListeners() {
    // Theme selection
    this.themeOptions.forEach(option => {
      option.addEventListener('click', () => this.handleThemeChange(option.dataset.theme));
    });

    // Font size change
    this.fontSizeSelect.addEventListener('change', () => this.handleFontSizeChange());

    // Language change
    this.languageSelect.addEventListener('change', () => this.handleLanguageChange());

    // Avatar upload
    this.userAvatarInput.addEventListener('change', (e) => this.handleAvatarUpload(e));

    // Profile save
    this.saveProfileBtn.addEventListener('click', () => this.saveProfile());

    // Password change
    this.changePasswordBtn.addEventListener('click', () => this.changePassword());

    // Danger zone actions
    this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    this.deleteAccountBtn.addEventListener('click', () => this.deleteAccount());
  }

  loadUserSettings() {
    // Load theme preference
    const savedTheme = localStorage.getItem('burmeAI_theme') || 'auto';
    document.body.dataset.theme = savedTheme;
    this.highlightSelectedTheme(savedTheme);

    // Load font size
    const savedFontSize = localStorage.getItem('burmeAI_fontSize') || 'medium';
    this.fontSizeSelect.value = savedFontSize;
    document.documentElement.style.setProperty('--font-size', this.getFontSizeValue(savedFontSize));

    // Load language
    const savedLanguage = localStorage.getItem('burmeAI_language') || 'en';
    this.languageSelect.value = savedLanguage;

    // Load user profile
    const userProfile = JSON.parse(localStorage.getItem('burmeAI_userProfile') || '{}');
    this.userNameInput.value = userProfile.name || '';
    this.userEmailInput.value = userProfile.email || '';
    if (userProfile.avatar) {
      this.avatarPreview.innerHTML = `<img src="${userProfile.avatar}" alt="User Avatar">`;
    }
  }

  handleThemeChange(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem('burmeAI_theme', theme);
    this.highlightSelectedTheme(theme);
    this.showToast(`Theme changed to ${theme}`);
  }

  highlightSelectedTheme(theme) {
    this.themeOptions.forEach(option => {
      option.classList.toggle('active', option.dataset.theme === theme);
    });
  }

  handleFontSizeChange() {
    const size = this.fontSizeSelect.value;
    const sizeValue = this.getFontSizeValue(size);
    document.documentElement.style.setProperty('--font-size', sizeValue);
    localStorage.setItem('burmeAI_fontSize', size);
    this.showToast(`Font size set to ${size}`);
  }

  getFontSizeValue(size) {
    const sizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    return sizes[size] || '16px';
  }

  handleLanguageChange() {
    const language = this.languageSelect.value;
    localStorage.setItem('burmeAI_language', language);
    this.showToast(`Language set to ${this.getLanguageName(language)}`);
    // In a real app, you would reload the UI translations here
  }

  getLanguageName(code) {
    const languages = {
      en: 'English',
      my: 'မြန်မာ',
      th: 'ไทย',
      zh: '中文',
      ru: 'Русский',
      vi: 'Tiếng Việt',
      km: 'ភាសាខ្មែរ'
    };
    return languages[code] || 'English';
  }

  handleAvatarUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      this.showToast('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.avatarPreview.innerHTML = `<img src="${e.target.result}" alt="User Avatar">`;
      this.showToast('Avatar updated');
    };
    reader.readAsDataURL(file);
  }

  saveProfile() {
    const userProfile = {
      name: this.userNameInput.value.trim(),
      email: this.userEmailInput.value.trim(),
      avatar: this.avatarPreview.querySelector('img')?.src || ''
    };

    localStorage.setItem('burmeAI_userProfile', JSON.stringify(userProfile));
    this.showToast('Profile saved successfully');
  }

  changePassword() {
    const currentPassword = this.currentPasswordInput.value;
    const newPassword = this.newPasswordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      this.showToast('Please fill all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showToast('New passwords do not match');
      return;
    }

    // In a real app, you would verify current password and update it
    this.showToast('Password changed successfully');
    this.currentPasswordInput.value = '';
    this.newPasswordInput.value = '';
    this.confirmPasswordInput.value = '';
  }

  clearHistory() {
    if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      localStorage.removeItem('burmeAI_chatHistory');
      this.showToast('Chat history cleared');
    }
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? All data will be permanently lost.')) {
      // In a real app, you would send a request to the server
      localStorage.clear();
      this.showToast('Account deleted. Redirecting...');
      setTimeout(() => window.location.href = '../index.html', 1500);
    }
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    }, 10);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SettingsManager();
});
