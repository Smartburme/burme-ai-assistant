document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const appContainer = document.getElementById('app-container');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('main-content');
    const menuToggle = document.getElementById('menu-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const chatHistory = document.getElementById('chat-history');
    const newChatButton = document.getElementById('new-chat');
    const themeToggle = document.getElementById('theme-toggle');
    const mobileViewBtn = document.getElementById('mobile-view');
    const desktopViewBtn = document.getElementById('desktop-view');
    const fullscreenViewBtn = document.getElementById('fullscreen-view');
    
    // State variables
    let currentChat = [];
    let isSidebarOpen = window.innerWidth > 1024;
    
    // Initialize the app
    init();
    
    function init() {
        setupEventListeners();
        loadChat();
        adjustTextareaHeight();
        checkThemePreference();
        setInitialViewMode();
        
        // Set logo and icon sizes
        document.querySelectorAll('.logo').forEach(logo => {
            logo.width = 40;
            logo.height = 40;
        });
        
        document.querySelectorAll('.icon').forEach(icon => {
            icon.style.width = '20px';
            icon.style.height = '20px';
        });
    }
    
    function setupEventListeners() {
        // Menu toggle
        menuToggle.addEventListener('click', toggleSidebar);
        closeSidebar.addEventListener('click', toggleSidebar);
        
        // Chat functionality
        messageInput.addEventListener('input', adjustTextareaHeight);
        messageInput.addEventListener('keydown', handleKeyDown);
        sendButton.addEventListener('click', sendMessage);
        newChatButton.addEventListener('click', startNewChat);
        
        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);
        
        // View mode toggles
        mobileViewBtn.addEventListener('click', () => setViewMode('mobile'));
        desktopViewBtn.addEventListener('click', () => setViewMode('desktop'));
        fullscreenViewBtn.addEventListener('click', toggleFullscreen);
        
        // Window resize handler
        window.addEventListener('resize', handleResize);
    }
    
    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
        
        if (window.innerWidth <= 1024) {
            sidebar.classList.toggle('open', isSidebarOpen);
            menuToggle.classList.toggle('active', isSidebarOpen);
            document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
        } else {
            sidebar.classList.toggle('collapsed', !isSidebarOpen);
            mainContent.style.marginLeft = isSidebarOpen ? '280px' : '0';
        }
    }
    
    function handleResize() {
        if (window.innerWidth > 1024) {
            isSidebarOpen = true;
            sidebar.classList.remove('open');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    function adjustTextareaHeight() {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    }
    
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }
    
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessageToChat('user', message);
        messageInput.value = '';
        adjustTextareaHeight();
        
        // Simulate AI response
        setTimeout(() => {
            addMessageToChat('ai', "This is a simulated AI response. In a real implementation, this would connect to an AI API.");
        }, 1000);
    }
    
    function addMessageToChat(role, content) {
        const message = { role, content, timestamp: new Date() };
        currentChat.push(message);
        saveChat();
        renderMessage(message);
    }
    
    function renderMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${message.role}`;
        
        messageElement.innerHTML = `
            <div class="chat-avatar">
                ${message.role === 'user' ? 'U' : 'AI'}
            </div>
            <div class="message-content">
                ${message.content}
            </div>
        `;
        
        chatHistory.appendChild(messageElement);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    function startNewChat() {
        if (currentChat.length > 0 && !confirm('Start a new chat? Your current chat will be cleared.')) {
            return;
        }
        
        currentChat = [];
        saveChat();
        chatHistory.innerHTML = '';
    }
    
    function saveChat() {
        localStorage.setItem('burme-ai-current-chat', JSON.stringify(currentChat));
    }
    
    function loadChat() {
        const savedChat = localStorage.getItem('burme-ai-current-chat');
        if (savedChat) {
            currentChat = JSON.parse(savedChat);
            currentChat.forEach(renderMessage);
        }
    }
    
    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('burme-ai-theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }
    
    function checkThemePreference() {
        const savedTheme = localStorage.getItem('burme-ai-theme') || 
                           (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
    }
    
    function setViewMode(mode) {
        // Reset all view modes
        appContainer.classList.remove('mobile-view', 'desktop-view', 'fullscreen-view');
        
        // Set the new mode
        if (mode === 'mobile') {
            appContainer.classList.add('mobile-view');
            mobileViewBtn.classList.add('active');
            desktopViewBtn.classList.remove('active');
            fullscreenViewBtn.classList.remove('active');
        } else if (mode === 'desktop') {
            appContainer.classList.add('desktop-view');
            desktopViewBtn.classList.add('active');
            mobileViewBtn.classList.remove('active');
            fullscreenViewBtn.classList.remove('active');
        }
        
        localStorage.setItem('burme-ai-view-mode', mode);
    }
    
    function setInitialViewMode() {
        const savedMode = localStorage.getItem('burme-ai-view-mode') || 'fullscreen';
        if (savedMode === 'mobile') {
            mobileViewBtn.click();
        } else if (savedMode === 'desktop') {
            desktopViewBtn.click();
        } else {
            fullscreenViewBtn.classList.add('active');
        }
    }
    
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            appContainer.requestFullscreen().then(() => {
                appContainer.classList.add('fullscreen-view');
                fullscreenViewBtn.classList.add('active');
                mobileViewBtn.classList.remove('active');
                desktopViewBtn.classList.remove('active');
                localStorage.setItem('burme-ai-view-mode', 'fullscreen');
            });
        } else {
            document.exitFullscreen().then(() => {
                appContainer.classList.remove('fullscreen-view');
                fullscreenViewBtn.classList.remove('active');
            });
        }
    }
    
    // Handle fullscreen change event
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            appContainer.classList.remove('fullscreen-view');
            fullscreenViewBtn.classList.remove('active');
        }
    });
});
