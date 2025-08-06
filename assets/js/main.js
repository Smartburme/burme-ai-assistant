document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');
    const newChatButton = document.getElementById('new-chat');
    
    // Load API Key from localStorage
    let apiKey = localStorage.getItem('burme-ai-api-key') || '';
    
    // Initialize chat
    function initChat() {
        // Load previous messages if any
        const savedChat = localStorage.getItem('burme-ai-chat');
        if (savedChat) {
            chatMessages.innerHTML = savedChat;
            scrollToBottom();
        }
    }
    
    // Send message function
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage('user', message);
        messageInput.value = '';
        
        // Show typing indicator
        const typingId = showTypingIndicator();
        
        try {
            // Call OpenAI API
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: "You are BURME AI, a helpful assistant that responds in Burmese. " +
                                     "Use simple, clear Burmese language. " +
                                     "If asked in English, respond in both English and Burmese."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.7
                })
            });
            
            const data = await response.json();
            removeTypingIndicator(typingId);
            
            if (data.choices && data.choices[0]) {
                addMessage('assistant', data.choices[0].message.content);
            } else {
                addMessage('assistant', "တောင်းပန်ပါသည်၊ အဖြေရှာမတွေ့ပါ။");
            }
        } catch (error) {
            removeTypingIndicator(typingId);
            addMessage('assistant', "အမှားတစ်ခုဖြစ်ပွားခဲ့သည်: " + error.message);
        }
    }
    
    // Add message to chat
    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const roleIcon = role === 'user' ? 'user' : 'robot';
        messageDiv.innerHTML = `
            <div class="message-icon">
                <i class="fas fa-${roleIcon}"></i>
            </div>
            <div class="message-content">
                ${marked.parse(content)}
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
        saveChat();
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingId = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant typing';
        typingDiv.id = typingId;
        typingDiv.innerHTML = `
            <div class="message-icon">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
        return typingId;
    }
    
    // Remove typing indicator
    function removeTypingIndicator(id) {
        const typingElement = document.getElementById(id);
        if (typingElement) {
            typingElement.remove();
        }
    }
    
    // Scroll to bottom of chat
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Save chat to localStorage
    function saveChat() {
        localStorage.setItem('burme-ai-chat', chatMessages.innerHTML);
    }
    
    // Clear chat
    function clearChat() {
        chatMessages.innerHTML = '';
        localStorage.removeItem('burme-ai-chat');
    }
    
    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    newChatButton.addEventListener('click', function() {
        if (chatMessages.children.length > 0) {
            if (confirm('လက်ရှိစကားဝိုင်းကို ဖျက်မည်။ ဆက်လုပ်ပါမည်လား?')) {
                clearChat();
            }
        }
    });
    
    // Tool buttons
    document.querySelectorAll('.tool-btn').forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            
            switch(action) {
                case 'clear':
                    if (confirm('စကားဝိုင်းအား ရှင်းလင်းမည်။ သေချာပါသလား?')) {
                        clearChat();
                    }
                    break;
                    
                case 'copy':
                    const messagesText = Array.from(chatMessages.querySelectorAll('.message-content'))
                        .map(el => el.textContent)
                        .join('\n\n');
                    navigator.clipboard.writeText(messagesText)
                        .then(() => alert('စကားဝိုင်းအား clipboard သို့ ကူးထည့်ပြီးပါပြီ။'));
                    break;
                    
                case 'save':
                    const chatHtml = chatMessages.innerHTML;
                    const blob = new Blob([chatHtml], { type: 'text/html' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `burme-ai-chat-${new Date().toISOString().slice(0,10)}.html`;
                    a.click();
                    break;
            }
        });
    });
    
    // Initialize chat
    initChat();
});
