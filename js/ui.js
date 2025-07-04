// js/ui.js

// Function to toggle mobile navigation menu
const toggleMobileMenu = () => {
    const navLinks = document.querySelector('nav ul');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
};

// Add event listener for menu icon
const menuIcon = document.querySelector('.menu-icon');
if (menuIcon) {
    menuIcon.addEventListener('click', toggleMobileMenu);
}

// Function to show loading spinner (used in index.html)
const showLoading = () => {
    const loadingContainer = document.querySelector('.loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'flex';
    }
};

// Function to hide loading spinner
const hideLoading = () => {
    const loadingContainer = document.querySelector('.loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
};

// Function to show a temporary bot thinking indicator in the chat
const showBotThinkingIndicator = () => {
    const chatMessagesArea = document.getElementById('chat-messages');
    if (!chatMessagesArea) return;

    removeBotThinkingIndicator(); // Remove any existing one first

    const thinkingElement = document.createElement('div');
    thinkingElement.classList.add('message', 'bot-message', 'bot-thinking');
    thinkingElement.id = 'bot-thinking-indicator'; // Assign an ID for easy removal
    thinkingElement.innerHTML = `
        <div class="thinking-animation"></div>
        <p>Thinking...</p>
    `;
    chatMessagesArea.appendChild(thinkingElement);
    chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight; // Scroll to bottom
};

// Function to remove the bot thinking indicator
const removeBotThinkingIndicator = () => {
    const indicator = document.getElementById('bot-thinking-indicator');
    if (indicator) {
        indicator.remove();
    }
};