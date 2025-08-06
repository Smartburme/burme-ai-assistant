/**
 * BURME AI - Main Application Script
 * 
 * This script handles the core functionality of the BURME AI interface
 * including chat operations, navigation, and UI interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ====================== Constants ======================
  const CLASSES = {
    ACTIVE: 'active',
    COLLAPSED: 'collapsed',
    HIDDEN: 'hidden',
    TYPING: 'typing-indicator'
  };

  const SELECTORS = {
    APP_CONTAINER: '.app-container',
    SIDEBAR: '.sidebar',
    SIDEBAR_TOGGLE: '.sidebar-toggle',
    NAV_LINKS: '[data-page]',
    CHAT_HISTORY: '#chatHistory',
    USER_INPUT: '#userInput',
    SEND_BUTTON: '#sendButton',
    NEW_CHAT_BUTTON: '.btn-new-chat',
    CHAT_SEARCH: '#chatSearch',
    LOGO_CONTAINER: '.logo-container',
    MOBILE_MENU_TOGGLE: '.mobile-menu-toggle'
  };

  const LOCAL_STORAGE_KEYS = {
    SIDEBAR_STATE: 'burme-sidebar-state',
    CHAT_HISTORY: 'burme-chat-history'
  };

  // ====================== State Management ======================
  const state = {
    isSidebarCollapsed: localStorage.getItem(LOCAL_STORAGE_KEYS.SIDEBAR_STATE) === 'true',
    currentChat: [],
    isTyping: false
  };

  // ====================== DOM Elements ======================
  const elements = {
    appContainer: document.querySelector(SELECTORS.APP_CONTAINER),
    sidebar: document.querySelector(SELECTORS.SIDEBAR),
    sidebarToggle: document.querySelector(SELECTORS.SIDEBAR_TOGGLE),
    navLinks: document.querySelectorAll(SELECTORS.NAV_LINKS),
    chatHistory: document.querySelector(SELECTORS.CHAT_HISTORY),
    userInput: document.querySelector(SELECTORS.USER_INPUT),
    sendButton: document.querySelector(SELECTORS.SEND_BUTTON),
    newChatButton: document.querySelector(SELECTORS.NEW_CHAT_BUTTON),
    chatSearch: document.querySelector(SELECTORS.CHAT_SEARCH),
    logoContainer: document.querySelector(SELECTORS.LOGO_CONTAINER),
    mobileMenuToggle: document.querySelector(SELECTORS.MOBILE_MENU_TOGGLE)
  };

  // ====================== Initialization ======================
  const init = () => {
    // Handle loader page
    if (document.querySelector('.loader-container')) {
      handleLoaderPage();
      return;
    }

    // Initialize UI state
    initSidebar();
    initNavigation();
    initChat();
    initEventListeners();
    loadChatHistory();

    // Apply initial state
    updateUI();
  };

  const handleLoaderPage = () => {
    setTimeout(() => {
      window.location.href = 'src/Pages/main.html';
    }, 2500);
  };

  const initSidebar = () => {
    if (state.isSidebarCollapsed) {
      elements.sidebar.classList.add(CLASSES.COLLAPSED);
    }
  };

  const initNavigation = () => {
    // Highlight current page
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    elements.navLinks.forEach(link => {
      if (link.dataset.page === currentPage) {
        link.classList.add(CLASSES.ACTIVE);
      }
    });
  };

  const initChat = () => {
    // Auto-resize textarea
    if (elements.userInput) {
      elements.userInput.style.height = 'auto';
      elements.userInput.style.height = `${elements.userInput.scrollHeight}px`;
    }
  };

  const initEventListeners = () => {
    // Sidebar toggle
    if (elements.sidebarToggle) {
      elements.sidebarToggle.addEventListener('click', toggleSidebar);
    }

    // Navigation links
    elements.navLinks.forEach(link => {
      link.addEventListener('click', handleNavigation);
    });

    // Chat input
    if (elements.sendButton) {
      elements.sendButton.addEventListener('click', sendMessage);
    }

    if (elements.userInput) {
      elements.userInput.addEventListener('keydown', handleInputKeyDown);
      elements.userInput.addEventListener('input', handleInputChange);
    }

    // New chat button
    if (elements.newChatButton) {
      elements.newChatButton.addEventListener('click', startNewChat);
    }

    // Chat search
    if (elements.chatSearch) {
      elements.chatSearch.addEventListener('input', handleSearch);
    }

    // Logo click (home navigation)
    if (elements.logoContainer) {
      elements.logoContainer.addEventListener('click', () => {
        window.location.href = 'main.html';
      });
    }

    // Mobile menu toggle
    if (elements.mobileMenuToggle) {
      elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Window resize handler
    window.addEventListener('resize', handleResize);
  };

  // ====================== Core Functions ======================
  const toggleSidebar = () => {
    state.isSidebarCollapsed = !state.isSidebarCollapsed;
    elements.sidebar.classList.toggle(CLASSES.COLLAPSED);
    localStorage.setItem(LOCAL_STORAGE_KEYS.SIDEBAR_STATE, state.isSidebarCollapsed);
    updateSidebarToggleIcon();
  };

  const updateSidebarToggleIcon = () => {
    if (elements.sidebarToggle) {
      const icon = elements.sidebarToggle.querySelector('i');
      if (state.isSidebarCollapsed) {
        icon.classList.replace('fa-chevron-left', 'fa-chevron-right');
      } else {
        icon.classList.replace('fa-chevron-right', 'fa-chevron-left');
      }
    }
  };

  const handleNavigation = (e) => {
    e.preventDefault();
    const page = e.currentTarget.dataset.page;
    navigateTo(page);
  };

  const navigateTo = (page) => {
    if (page === 'main') {
      window.location.href = 'main.html';
    } else {
      window.location.href = `${page}.html`;
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const sendMessage = () => {
    const message = elements.userInput.value.trim();
    if (!message || state.isTyping) return;

    // Add user message
    addMessage('user', message);
    elements.userInput.value = '';
    elements.userInput.style.height = 'auto';

    // Show typing indicator
    showTypingIndicator();

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      hideTypingIndicator();
      addMessage('ai', generateAIResponse(message));
      saveChatHistory();
    }, 1500);
  };

  const addMessage = (sender, content) => {
    const message = {
      sender,
      content,
      timestamp: new Date().toISOString()
    };

    state.currentChat.push(message);
    renderMessage(message);
  };

  const renderMessage = (message) => {
    const messageElement = createMessageElement(message);
    elements.chatHistory.appendChild(messageElement);
    elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
  };

  const createMessageElement = (message) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${message.sender}-message`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    
    if (message.sender === 'user') {
      avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
    } else {
      avatarDiv.innerHTML = '<img src="../../assets/image/logo.png" alt="BURME AI" width="32" height="32">';
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = message.content;

    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'message-timestamp';
    timestampDiv.textContent = formatTimestamp(message.timestamp);

    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    messageDiv.appendChild(timestampDiv);

    return messageDiv;
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const showTypingIndicator = () => {
    state.isTyping = true;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = CLASSES.TYPING;
    typingDiv.innerHTML = `
      <div class="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span>BURME AI is typing...</span>
    `;
    typingDiv.id = 'typing-indicator';
    elements.chatHistory.appendChild(typingDiv);
    elements.chatHistory.scrollTop = elements.chatHistory.scrollHeight;
  };

  const hideTypingIndicator = () => {
    state.isTyping = false;
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  };

  const generateAIResponse = (userMessage) => {
    // This is a placeholder - replace with actual AI API integration
    const responses = [
      "I understand your question about '" + userMessage + "'. Here's what I can tell you...",
      "That's an interesting point about '" + userMessage + "'. From my knowledge...",
      "Regarding '" + userMessage + "', the information I have suggests that...",
      "I've analyzed your query about '" + userMessage + "' and here's my response..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const startNewChat = () => {
    if (state.currentChat.length === 0) return;
    
    if (confirm('Start a new chat? Your current chat will be cleared.')) {
      state.currentChat = [];
      elements.chatHistory.innerHTML = '';
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CHAT_HISTORY);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    // Implement search functionality as needed
    console.log('Searching for:', searchTerm);
  };

  const toggleMobileMenu = () => {
    elements.sidebar.classList.toggle('open');
  };

  const handleResize = () => {
    // Handle responsive behaviors
    if (window.innerWidth < 768) {
      elements.sidebar.classList.remove(CLASSES.COLLAPSED);
    }
  };

  // ====================== Data Persistence ======================
  const saveChatHistory = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(state.currentChat));
  };

  const loadChatHistory = () => {
    const savedChat = localStorage.getItem(LOCAL_STORAGE_KEYS.CHAT_HISTORY);
    if (savedChat) {
      state.currentChat = JSON.parse(savedChat);
      state.currentChat.forEach(message => renderMessage(message));
    }
  };

  // ====================== UI Updates ======================
  const updateUI = () => {
    updateSidebarToggleIcon();
  };

  // Initialize the application
  init();
});
