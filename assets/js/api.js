// BURME AI - API Key Management Module
class ApiKeyManager {
  constructor() {
    // DOM Elements
    this.apiForm = document.getElementById('apiForm');
    this.apiKeyName = document.getElementById('apiKeyName');
    this.apiKeyValue = document.getElementById('apiKeyValue');
    this.apiService = document.getElementById('apiService');
    this.saveApiBtn = document.getElementById('saveApiBtn');
    this.cancelApiBtn = document.getElementById('cancelApiBtn');
    this.addApiKeyBtn = document.getElementById('addApiKeyBtn');
    this.apiKeysTable = document.getElementById('apiKeysTable');
    this.toggleVisibilityBtn = document.querySelector('.toggle-visibility');

    this.editingKeyId = null;
    this.initEventListeners();
    this.loadApiKeys();
  }

  initEventListeners() {
    // Form submission
    this.apiForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveApiKey();
    });

    // Cancel button
    this.cancelApiBtn.addEventListener('click', () => this.cancelEditing());

    // Add new key button
    this.addApiKeyBtn.addEventListener('click', () => this.showForm());

    // Toggle key visibility
    this.toggleVisibilityBtn.addEventListener('click', () => this.toggleKeyVisibility());

    // Initialize empty state
    this.checkEmptyState();
  }

  loadApiKeys() {
    const apiKeys = JSON.parse(localStorage.getItem('burmeAI_apiKeys') || '[]');
    
    if (apiKeys.length > 0) {
      this.apiKeysTable.innerHTML = '';
      apiKeys.forEach(key => this.addKeyToTable(key));
    }
    
    this.checkEmptyState();
  }

  addKeyToTable(key) {
    const keyRow = document.createElement('div');
    keyRow.className = 'table-row';
    keyRow.dataset.keyId = key.id;
    
    keyRow.innerHTML = `
      <div class="col-name">${key.name}</div>
      <div class="col-service">${this.getServiceName(key.service)}</div>
      <div class="col-status">
        <span class="status-badge ${key.verified ? 'verified' : 'unverified'}">
          ${key.verified ? 'Verified' : 'Unverified'}
        </span>
      </div>
      <div class="col-actions">
        <button class="action-btn edit-btn" title="Edit">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn delete-btn" title="Delete">
          <i class="fas fa-trash-alt"></i>
        </button>
        <button class="action-btn verify-btn" title="Verify">
          <i class="fas fa-check-circle"></i>
        </button>
      </div>
    `;
    
    // Add event listeners to action buttons
    keyRow.querySelector('.edit-btn').addEventListener('click', () => this.editApiKey(key.id));
    keyRow.querySelector('.delete-btn').addEventListener('click', () => this.deleteApiKey(key.id));
    keyRow.querySelector('.verify-btn').addEventListener('click', () => this.verifyApiKey(key.id));
    
    this.apiKeysTable.appendChild(keyRow);
  }

  getServiceName(serviceCode) {
    const services = {
      openai: 'OpenAI',
      stabilityai: 'Stability AI',
      googleai: 'Google AI',
      anthropic: 'Anthropic',
      custom: 'Custom'
    };
    return services[serviceCode] || serviceCode;
  }

  showForm(key = null) {
    this.apiForm.style.display = 'block';
    this.addApiKeyBtn.style.display = 'none';
    
    if (key) {
      this.apiKeyName.value = key.name;
      this.apiKeyValue.value = key.value;
      this.apiService.value = key.service;
      this.editingKeyId = key.id;
      this.saveApiBtn.textContent = 'Update Key';
    } else {
      this.apiForm.reset();
      this.editingKeyId = null;
      this.saveApiBtn.textContent = 'Save Key';
    }
  }

  hideForm() {
    this.apiForm.style.display = 'none';
    this.addApiKeyBtn.style.display = 'block';
  }

  cancelEditing() {
    this.hideForm();
    this.apiForm.reset();
    this.editingKeyId = null;
  }

  toggleKeyVisibility() {
    const icon = this.toggleVisibilityBtn.querySelector('i');
    if (this.apiKeyValue.type === 'password') {
      this.apiKeyValue.type = 'text';
      icon.classList.remove('fa-eye');
      icon.classList.add('fa-eye-slash');
    } else {
      this.apiKeyValue.type = 'password';
      icon.classList.remove('fa-eye-slash');
      icon.classList.add('fa-eye');
    }
  }

  saveApiKey() {
    const name = this.apiKeyName.value.trim();
    const value = this.apiKeyValue.value.trim();
    const service = this.apiService.value;

    if (!name || !value) {
      this.showToast('Please fill all required fields');
      return;
    }

    // Validate API key format based on service
    if (service === 'openai' && !value.startsWith('sk-')) {
      this.showToast('OpenAI keys typically start with "sk-"');
      return;
    }

    const apiKeys = JSON.parse(localStorage.getItem('burmeAI_apiKeys') || '[]');
    
    if (this.editingKeyId) {
      // Update existing key
      const index = apiKeys.findIndex(k => k.id === this.editingKeyId);
      if (index !== -1) {
        apiKeys[index] = { ...apiKeys[index], name, value, service };
      }
    } else {
      // Add new key
      apiKeys.push({
        id: Date.now().toString(),
        name,
        value,
        service,
        verified: false,
        createdAt: new Date().toISOString()
      });
    }

    localStorage.setItem('burmeAI_apiKeys', JSON.stringify(apiKeys));
    this.loadApiKeys();
    this.hideForm();
    this.showToast(`API key ${this.editingKeyId ? 'updated' : 'saved'} successfully`);
  }

  editApiKey(keyId) {
    const apiKeys = JSON.parse(localStorage.getItem('burmeAI_apiKeys') || '[]');
    const key = apiKeys.find(k => k.id === keyId);
    if (key) {
      this.showForm(key);
    }
  }

  deleteApiKey(keyId) {
    if (confirm('Are you sure you want to delete this API key?')) {
      const apiKeys = JSON.parse(localStorage.getItem('burmeAI_apiKeys') || '[]');
      const filteredKeys = apiKeys.filter(k => k.id !== keyId);
      localStorage.setItem('burmeAI_apiKeys', JSON.stringify(filteredKeys));
      this.loadApiKeys();
      this.showToast('API key deleted');
    }
  }

  async verifyApiKey(keyId) {
    const apiKeys = JSON.parse(localStorage.getItem('burmeAI_apiKeys') || '[]');
    const keyIndex = apiKeys.findIndex(k => k.id === keyId);
    
    if (keyIndex === -1) return;
    
    const key = apiKeys[keyIndex];
    this.showToast(`Verifying ${key.name}...`);
    
    try {
      // Simulate API verification (replace with actual verification)
      const verified = await this.mockVerifyApiKey(key.value, key.service);
      
      apiKeys[keyIndex].verified = verified;
      localStorage.setItem('burmeAI_apiKeys', JSON.stringify(apiKeys));
      this.loadApiKeys();
      
      this.showToast(verified 
        ? 'API key verified successfully' 
        : 'API key verification failed');
    } catch (error) {
      console.error('Verification error:', error);
      this.showToast('Verification failed. Please try again.');
    }
  }

  async mockVerifyApiKey(key, service) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock verification - 80% chance of success
    return Math.random() < 0.8;
  }

  checkEmptyState() {
    const apiKeys = JSON.parse(localStorage.getItem('burmeAI_apiKeys') || '[]');
    if (apiKeys.length === 0) {
      this.apiKeysTable.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-key"></i>
          <p>No API keys registered yet</p>
        </div>
      `;
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
  new ApiKeyManager();
});
