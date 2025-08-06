// Loader Page Logic
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('loader-page')) {
        setTimeout(() => {
            window.location.href = 'src/pages/main.html';
        }, 3000);
    }
});

// Main Page Logic
if (document.body.classList.contains('main-page')) {
    // Menu Toggle Functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.hyper-sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Chat Functionality
    const chatInput = document.querySelector('.input-area textarea');
    const sendButton = document.querySelector('.send-button');
    const chatHistory = document.querySelector('.chat-history');
    
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            addMessageToHistory('user', message);
            chatInput.value = '';
            
            // Simulate AI response (will replace with actual API call)
            setTimeout(() => {
                addMessageToHistory('ai', 'ကျေးဇူးပြု၍ မေးခွန်းမေးပါ။ BURME AI ကသင့်ကိုကူညီရန် အဆင်သင့်ဖြစ်နေပါပြီ။');
            }, 1000);
        }
    }

    function addMessageToHistory(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message', sender);
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
}
