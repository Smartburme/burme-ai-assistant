document.addEventListener('DOMContentLoaded', function() {
    // Loader animation
    if (document.querySelector('.loader-container')) {
        setTimeout(() => {
            window.location.href = 'src/Pages/main.html';
        }, 2500);
        return;
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
    
    // Chat functionality
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
    }
    
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        // Add user message to chat
        addMessageToChat('user', message);
        userInput.value = '';
        
        // Simulate AI response
        setTimeout(() => {
            addMessageToChat('ai', 'This is a simulated response from BURME AI. In the full implementation, this would connect to the actual AI API.');
        }, 1000);
    }
    
    function addMessageToChat(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'ai-message');
        messageDiv.textContent = text;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    // New chat button
    const newChatBtn = document.querySelector('.btn-new-chat');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', function() {
            if (confirm('Start a new chat? Your current chat will be cleared.')) {
                chatHistory.innerHTML = '';
            }
        });
    }
});
