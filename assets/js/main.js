document.addEventListener('DOMContentLoaded', function() {
    // Loader animation (if on index page)
    if (document.querySelector('.loader-container')) {
        setTimeout(() => {
            window.location.href = 'src/Pages/main.html';
        }, 2500);
        return;
    }
    
    // Toggle sidebar functionality
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.classList.remove('fa-chevron-left');
                icon.classList.add('fa-chevron-right');
            } else {
                icon.classList.remove('fa-chevron-right');
                icon.classList.add('fa-chevron-left');
            }
        });
    }
    
    // Navigation between pages
    const navLinks = document.querySelectorAll('[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page === 'main') {
                window.location.href = 'main.html';
            } else {
                window.location.href = `${page}.html`;
            }
        });
    });
    
    // Chat functionality with typing indicator
    const chatHistory = document.getElementById('chatHistory');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Auto-resize textarea
        userInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    }
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessageToChat('user', message);
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Show typing indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <span>BURME AI is typing...</span>
        `;
        chatHistory.appendChild(typingIndicator);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        
        // Simulate AI response after delay
        setTimeout(() => {
            // Remove typing indicator
            if (typingIndicator.parentNode) {
                typingIndicator.remove();
            }
            
            // Add AI response
            addMessageToChat('ai', 'This is an enhanced response from BURME AI. In the full implementation, this would connect to the actual AI API.');
        }, 1500);
    }
    
    function addMessageToChat(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        
        // Add avatar
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        if (sender === 'user') {
            avatar.innerHTML = '<i class="fas fa-user"></i>';
        } else {
            avatar.innerHTML = '<img src="../../assets/image/logo.png" alt="BURME AI" width="32" height="32">';
        }
        
        // Add content
        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;
        
        // Add timestamp
        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        timestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messageDiv.appendChild(timestamp);
        
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    // New chat button functionality
    const newChatBtn = document.querySelector('.btn-new-chat');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', function() {
            if (chatHistory.children.length > 0 && confirm('Start a new chat? Your current chat will be cleared.')) {
                chatHistory.innerHTML = '';
            }
        });
    }
    
    // Search functionality
    const chatSearch = document.getElementById('chatSearch');
    if (chatSearch) {
        chatSearch.addEventListener('input', function() {
            // Implement search functionality here
            console.log('Searching for:', this.value);
        });
    }
});
