// BURME AI - Main Chat Application
class BURMEChat {
  constructor() {
    this.messages = [];
    this.chatHistory = [];
    this.currentChatId = null;
    this.isDarkMode = false;
    this.isTyping = false;

    // Initialize DOM elements
    this.messageInput = document.getElementById('messageInput');
    this.sendButton = document.getElementById('sendButton');
    this.chatMessages = document.getElementById('chatMessages');
    this.historyList = document.getElementById('historyList');
    this.navItems = document.querySelectorAll('.nav-item');
    this.newChatBtn = document.querySelector('.new-chat-btn');
    this.settingsBtn = document.querySelector('.settings-btn');
    this.themeToggle = document.getElementById('themeToggle');

    // Initialize the app
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadThemePreference();
    this.loadChatHistory();
    this.createNewChat();
    this.setupAutoResize();
  }

  setupEventListeners() {
    // Message input events
    this.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
    
    // Button events
    this.sendButton.addEventListener('click', () => this.handleSendMessage());
    this.newChatBtn.addEventListener('click', () => this.createNewChat());
    this.settingsBtn.addEventListener('click', () => this.navigateTo('settings'));

    // Navigation events
    this.navItems.forEach(item => {
      item.addEventListener('click', () => {
        const page = item.dataset.page;
        if (page) this.navigateTo(page);
      });
    });

    // History item events (event delegation)
    this.historyList.addEventListener('click', (e) => {
      const historyItem = e.target.closest('.history-item');
      if (historyItem) {
        const chatId = historyItem.dataset.chatId;
        if (chatId) this.loadChat(chatId);
      }
    });

    // Theme toggle if available
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  setupAutoResize() {
    this.messageInput.addEventListener('input', () => {
      this.messageInput.style.height = 'auto';
      this.messageInput.style.height = `${Math.min(this.messageInput.scrollHeight, 200)}px`;
    });
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
    const userMessage = {
      id: this.generateId(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    this.addMessageToChat(userMessage);
    this.clearInput();
    
    try {
      // Show typing indicator
      this.showTypingIndicator();
      
      // Get AI response (simulated delay)
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

  async getAIResponse(userInput) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    
    // Enhanced mock responses
    const responses = [
      `I've analyzed your query about "${userInput}". Here's a detailed response...`,
      `That's an interesting question! Regarding "${userInput}", here's what I found...`,
      `Let me help with "${userInput}". Here's the information you need...`,
      `I understand you're asking about "${userInput}". Here's my comprehensive answer...`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      id: this.generateId(),
      content: `${randomResponse}\n\n**Example Code:**\n\`\`\`javascript\n// ${userInput} example\nfunction example() {\n  return "BURME AI Response";\n}\n\`\`\`\n\n[Learn More](#) | [Related Topics](#)`,
      sender: 'ai',
      timestamp: new Date()
    };
  }

  clearInput() {
    this.messageInput.value = '';
    this.messageInput.style.height = 'auto';
    this.messageInput.focus();
  }

  addMessageToChat(message) {
    this.messages.push(message);
    this.renderMessage(message);
    this.scrollToBottom();
  }

  renderMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${message.sender}`;
    
    messageElement.innerHTML = `
      <div class="message-meta">
        <span>${message.sender === 'user' ? 'You' : 'BURME AI'}</span>
        <span>•</span>
        <span>${this.formatTime(message.timestamp)}</span>
      </div>
      <div class="message-content">${this.markdownToHtml(message.content)}</div>
    `;
    
    this.chatMessages.appendChild(messageElement);
  }

  markdownToHtml(text) {
    // Enhanced markdown parser
    return text
      .replace(/```(\w*)\n([\s\S]*?)\n```/g, '<pre><code class="$1">$2</code></pre>')
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
    this.addMessageToChat({
      id: this.generateId(),
      content: '**Error:** Sorry, I encountered an issue. Please try again later or check your connection.',
      sender: 'ai',
      timestamp: new Date()
    });
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  createNewChat() {
    this.currentChatId = this.generateId();
    this.messages = [];
    this.chatMessages.innerHTML = '';
    
    // Add welcome message
    this.addMessageToChat({
      id: this.generateId(),
      content: '**Welcome to BURME AI!**\n\nI can help with:\n- Answering questions\n- Generating text\n- Creating code\n- Analyzing data\n\nHow can I assist you today?',
      sender: 'ai',
      timestamp: new Date()
    });
    
    this.updateChatHistory('New chat started');
  }

  loadChat(chatId) {
    // In a real implementation, load from storage/API
    console.log(`Loading chat: ${chatId}`);
    this.currentChatId = chatId;
    this.messages = [];
    this.chatMessages.innerHTML = '';
    
    // Simulate loaded messages
    this.addMessageToChat({
      id: this.generateId(),
      content: 'Continuing previous conversation...',
      sender: 'ai',
      timestamp: new Date()
    });
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
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }

  loadChatHistory() {
    // Load from localStorage
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
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new BURMEChat();
});
