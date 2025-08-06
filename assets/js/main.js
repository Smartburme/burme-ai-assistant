// BURME AI - Enhanced Main Chat Application
class BURMEChat {
    constructor() {
        this.messages = [];
        this.chatHistory = [];
        this.currentChatId = null;
        this.isDarkMode = false;
        this.isTyping = false;

        // Initialize DOM elements
        this.initElements();
        this.setupEventListeners();
        this.loadThemePreference();
        this.loadChatHistory();
        this.createNewChat();
    }

    initElements() {
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.chatMessages = document.getElementById('chatMessages');
        this.historyList = document.getElementById('historyList');
        this.newChatBtn = document.querySelector('.new-chat-btn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.settingsBtn = document.querySelector('[data-page="settings"]');
        this.aboutBtn = document.querySelector('[data-page="about"]');
        this.navItems = document.querySelectorAll('.nav-item');
    }

    setupEventListeners() {
        // Message input events
        this.messageInput.addEventListener('input', () => this.handleInputResize());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Button events
        this.sendButton.addEventListener('click', () => this.handleSendMessage());
        this.newChatBtn.addEventListener('click', () => this.createNewChat());
        this.clearHistoryBtn.addEventListener('click', () => this.clearAllHistory());
        
        // Navigation events
        this.settingsBtn.addEventListener('click', () => this.navigateTo('settings'));
        this.aboutBtn.addEventListener('click', () => this.navigateTo('about'));
        
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                if (page) this.navigateTo(page);
            });
        });

        // History item events (delegated)
        this.historyList.addEventListener('click', (e) => {
            const historyItem = e.target.closest('.history-item');
            if (historyItem) {
                const chatId = historyItem.dataset.chatId;
                if (chatId) this.loadChat(chatId);
            }
        });
    }

    handleInputResize() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = `${Math.min(this.messageInput.scrollHeight, 200)}px`;
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendMessage();
        }
    }

    async handleSendMessage() {
        const content = this.messageInput.value.trim();
        if (!content || this.isTyping) return;

        // Add user message
        const userMessage = this.createMessage(content, 'user');
        this.addMessageToChat(userMessage);
        this.clearInput();

        try {
            this.showTypingIndicator();
            
            // Simulate AI response (replace with actual API call)
            const aiResponse = await this.getAIResponse(content);
            
            this.addMessageToChat(aiResponse);
            this.updateChatHistory(aiResponse.content);
        } catch (error) {
            console.error('Error:', error);
            this.addErrorMessage();
        } finally {
            this.hideTypingIndicator();
        }
    }

    createMessage(content, sender) {
        return {
            id: Date.now().toString(),
            content,
            sender,
            timestamp: new Date()
        };
    }

    async getAIResponse(userInput) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // Enhanced mock responses with markdown formatting
        const responses = [
            `I understand you're asking about **${userInput}**. Here's what I can tell you...\n\n` +
            `Key points:\n- First important aspect\n- Second consideration\n- Final recommendation\n\n` +
            `Example code:\n\`\`\`javascript\n// ${userInput} example\nfunction example() {\n  return "BURME AI Response";\n}\n\`\`\``,
            
            `That's an interesting question about *${userInput}*. Let me explain:\n\n` +
            `1. Primary factor\n2. Secondary consideration\n3. Additional context\n\n` +
            `You might also want to check [this resource](#) for more information.`,
            
            `Regarding "${userInput}", here's the information you requested:\n\n` +
            `- **Definition**: Explanation of the concept\n` +
            `- **Usage**: How it's typically applied\n` +
            `- **Examples**: Practical implementations\n\n` +
            `Let me know if you'd like me to elaborate on any of these points.`
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        return this.createMessage(randomResponse, 'ai');
    }

    addMessageToChat(message) {
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }

    renderMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${message.sender}`;
        
        const metaElement = document.createElement('div');
        metaElement.className = 'message-meta';
        metaElement.innerHTML = `
            <span>${message.sender === 'user' ? 'You' : 'BURME AI'}</span>
            <span>•</span>
            <span>${this.formatTime(message.timestamp)}</span>
        `;
        
        const contentElement = document.createElement('div');
        contentElement.className = 'message-content';
        contentElement.innerHTML = this.markdownToHtml(message.content);
        
        messageElement.appendChild(metaElement);
        messageElement.appendChild(contentElement);
        this.chatMessages.appendChild(messageElement);
    }

    markdownToHtml(text) {
        // Simple markdown parsing
        return text
            .replace(/```([a-z]*)\n([\s\S]*?)\n```/g, '<pre><code class="$1">$2</code></pre>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/\n/g, '<br>');
    }

    showTypingIndicator() {
        this.isTyping = true;
        this.sendButton.disabled = true;
        
        const typingElement = document.createElement('div');
        typingElement.className = 'message message-ai typing-indicator';
        typingElement.id = 'typingIndicator';
        typingElement.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        
        this.chatMessages.appendChild(typingElement);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.isTyping = false;
        this.sendButton.disabled = false;
        const typingElement = document.getElementById('typingIndicator');
        if (typingElement) typingElement.remove();
    }

    addErrorMessage() {
        this.addMessageToChat(
            this.createMessage(
                '**Error**: Sorry, I encountered an issue. Please try again later or check your connection.',
                'ai'
            )
        );
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    clearInput() {
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.messageInput.focus();
    }

    createNewChat() {
        this.currentChatId = Date.now().toString();
        this.messages = [];
        this.chatMessages.innerHTML = '';
        
        // Add welcome message
        const welcomeMessage = this.createMessage(
            '**Welcome to BURME AI!**\n\nHow can I assist you today?\n\nI can help with:\n- Answering questions\n- Generating text\n- Creating code\n- Analyzing data',
            'ai'
        );
        
        this.addMessageToChat(welcomeMessage);
        this.updateChatHistory('New chat started');
    }

    loadChat(chatId) {
        // In a real app, load from storage/API
        console.log(`Loading chat: ${chatId}`);
        this.currentChatId = chatId;
        this.messages = [];
        this.chatMessages.innerHTML = '';
        
        // Simulate loaded messages
        const loadedMessage = this.createMessage(
            'Continuing previous conversation...',
            'ai'
        );
        this.addMessageToChat(loadedMessage);
    }

    updateChatHistory(lastMessage) {
        if (!this.currentChatId) return;
        
        const existingChat = this.chatHistory.find(chat => chat.id === this.currentChatId);
        const title = lastMessage.length > 30 
            ? `${lastMessage.substring(0, 30)}...` 
            : lastMessage;
        
        if (existingChat) {
            existingChat.lastMessage = lastMessage;
            existingChat.timestamp = new Date();
        } else {
            this.chatHistory.unshift({
                id: this.currentChatId,
                title,
                lastMessage,
                timestamp: new Date()
            });
        }
        
        this.renderChatHistory();
        this.saveChatHistory();
    }

    renderChatHistory() {
        this.historyList.innerHTML = this.chatHistory
            .map(chat => `
                <li class="history-item" data-chat-id="${chat.id}">
                    <i class="fas fa-comment-alt"></i>
                    <span>${chat.title}</span>
                    <small>${this.formatDate(chat.timestamp)}</small>
                </li>
            `)
            .join('');
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString([], { 
            month: 'short', 
            day: 'numeric' 
        });
    }

    clearAllHistory() {
        if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
            this.chatHistory = [];
            this.historyList.innerHTML = '';
            localStorage.removeItem('burmeAI_chatHistory');
            this.showToast('Chat history cleared');
        }
    }

    loadChatHistory() {
        const savedHistory = localStorage.getItem('burmeAI_chatHistory');
        if (savedHistory) {
            try {
                this.chatHistory = JSON.parse(savedHistory).map(chat => ({
                    ...chat,
                    timestamp: new Date(chat.timestamp)
                }));
                this.renderChatHistory();
            } catch (e) {
                console.error('Failed to parse chat history', e);
            }
        }
    }

    saveChatHistory() {
        localStorage.setItem(
            'burmeAI_chatHistory',
            JSON.stringify(this.chatHistory)
        );
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('burmeAI_theme');
        this.isDarkMode = savedTheme === 'dark';
        document.body.classList.toggle('dark-mode', this.isDarkMode);
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        document.body.classList.toggle('dark-mode', this.isDarkMode);
        localStorage.setItem(
            'burmeAI_theme',
            this.isDarkMode ? 'dark' : 'light'
        );
    }

    navigateTo(page) {
        console.log(`Navigating to ${page}`);
        // In a SPA, you would handle page transitions here
        // For multi-page app, this would change the window.location
        if (page === 'settings' || page === 'about') {
            window.location.href = `../${page}/${page}.html`;
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

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BURMEChat();
});
