document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const apiKeyForm = document.querySelector('.api-key-form');
    const apiKeyNameInput = document.getElementById('api-key-name');
    const apiKeyValueInput = document.getElementById('api-key-value');
    const apiKeySourceSelect = document.getElementById('api-key-source');
    const saveApiKeyBtn = document.getElementById('save-api-key');
    const toggleVisibilityBtn = document.getElementById('toggle-visibility');
    const apiKeysContainer = document.getElementById('api-keys-container');
    const confirmModal = document.getElementById('confirm-modal');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const copyCurlBtn = document.getElementById('copy-curl');
    
    // State variables
    let apiKeys = JSON.parse(localStorage.getItem('burme-ai-api-keys')) || [];
    let keyToDelete = null;
    
    // Initialize the page
    init();
    
    function init() {
        renderApiKeyList();
        setupEventListeners();
        loadUsageStatistics();
    }
    
    function setupEventListeners() {
        // Save API key
        saveApiKeyBtn.addEventListener('click', saveApiKey);
        
        // Toggle key visibility
        toggleVisibilityBtn.addEventListener('click', toggleKeyVisibility);
        
        // Modal buttons
        confirmDeleteBtn.addEventListener('click', deleteApiKey);
        cancelDeleteBtn.addEventListener('click', closeModal);
        
        // Copy cURL example
        copyCurlBtn.addEventListener('click', copyCurlExample);
    }
    
    function saveApiKey() {
        const name = apiKeyNameInput.value.trim();
        const value = apiKeyValueInput.value.trim();
        const source = apiKeySourceSelect.value;
        
        if (!name || !value) {
            showAlert('Please fill in all fields', 'error');
            return;
        }
        
        // Check if key already exists
        const existingKey = apiKeys.find(key => key.value === value);
        if (existingKey) {
            showAlert('This API key is already saved', 'error');
            return;
        }
        
        const newKey = {
            id: generateId(),
            name,
            value,
            source,
            createdAt: new Date().toISOString(),
            lastUsed: null,
            isActive: true
        };
        
        apiKeys.push(newKey);
        saveKeysToLocalStorage();
        renderApiKeyList();
        
        // Reset form
        apiKeyNameInput.value = '';
        apiKeyValueInput.value = '';
        
        showAlert('API key saved successfully', 'success');
    }
    
    function renderApiKeyList() {
        if (apiKeys.length === 0) {
            apiKeysContainer.innerHTML = '<div class="no-keys">No API keys saved yet</div>';
            return;
        }
        
        apiKeysContainer.innerHTML = '';
        
        apiKeys.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.className = 'api-key-item';
            
            keyElement.innerHTML = `
                <span>${key.name}</span>
                <span>${formatSource(key.source)}</span>
                <span>${key.lastUsed ? formatDate(key.lastUsed) : 'Never'}</span>
                <div class="key-actions">
                    <button class="toggle-key-btn ${key.isActive ? 'active' : 'inactive'}" data-id="${key.id}">
                        ${key.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button class="delete-key-btn" data-id="${key.id}">Delete</button>
                </div>
            `;
            
            apiKeysContainer.appendChild(keyElement);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.toggle-key-btn').forEach(btn => {
            btn.addEventListener('click', toggleKeyStatus);
        });
        
        document.querySelectorAll('.delete-key-btn').forEach(btn => {
            btn.addEventListener('click', confirmDelete);
        });
    }
    
    function toggleKeyStatus(e) {
        const keyId = e.target.dataset.id;
        const keyIndex = apiKeys.findIndex(key => key.id === keyId);
        
        if (keyIndex !== -1) {
            apiKeys[keyIndex].isActive = !apiKeys[keyIndex].isActive;
            saveKeysToLocalStorage();
            renderApiKeyList();
            
            const status = apiKeys[keyIndex].isActive ? 'enabled' : 'disabled';
            showAlert(`API key ${status} successfully`, 'success');
        }
    }
    
    function confirmDelete(e) {
        keyToDelete = e.target.dataset.id;
        confirmModal.style.display = 'flex';
    }
    
    function deleteApiKey() {
        apiKeys = apiKeys.filter(key => key.id !== keyToDelete);
        saveKeysToLocalStorage();
        renderApiKeyList();
        closeModal();
        showAlert('API key deleted successfully', 'success');
    }
    
    function closeModal() {
        confirmModal.style.display = 'none';
        keyToDelete = null;
    }
    
    function toggleKeyVisibility() {
        const type = apiKeyValueInput.type === 'password' ? 'text' : 'password';
        apiKeyValueInput.type = type;
        toggleVisibilityBtn.innerHTML = type === 'password' ? '👁️' : '👁️‍🗨️';
    }
    
    function loadUsageStatistics() {
        // In a real app, this would come from an API
        const usageData = JSON.parse(localStorage.getItem('burme-ai-api-usage')) || {
            totalRequests: 0,
            tokensUsed: 0,
            successRate: 100
        };
        
        document.getElementById('total-requests').textContent = usageData.totalRequests;
        document.getElementById('tokens-used').textContent = usageData.tokensUsed;
        document.getElementById('success-rate').textContent = `${usageData.successRate}%`;
        
        renderUsageChart();
    }
    
    function renderUsageChart() {
        const ctx = document.getElementById('usage-chart').getContext('2d');
        
        // Sample data - in a real app, this would come from an API
        const data = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'API Requests',
                data: [12, 19, 3, 5, 2, 3],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
        
        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    function copyCurlExample() {
        const curlCommand = `curl -X POST https://api.burme.ai/v1/chat/completions \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-d '{
  "model": "gpt-4",
  "messages": [{"role": "user", "content": "Hello!"}]
}'`;
        
        navigator.clipboard.writeText(curlCommand).then(() => {
            showAlert('cURL example copied to clipboard', 'success');
        });
    }
    
    // Helper functions
    function saveKeysToLocalStorage() {
        localStorage.setItem('burme-ai-api-keys', JSON.stringify(apiKeys));
    }
    
    function generateId() {
        return Math.random().toString(36).substr(2, 9);
    }
    
    function formatSource(source) {
        const sources = {
            'openai': 'OpenAI',
            'custom': 'Custom'
        };
        return sources[source] || source;
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    }
    
    function showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }
});
