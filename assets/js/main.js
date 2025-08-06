// Chat အပြန်အလှန် စနစ်
class ChatSystem {
  constructor() {
    this.chatHistory = [];
    this.apiKey = localStorage.getItem('burme_ai_api_key') || '';
  }

  sendMessage(message) {
    // API နဲ့ ချိတ်ဆက်ပြီး အဖြေရယူမယ့် logic
    console.log('Message sent:', message);
  }

  clearChat() {
    this.chatHistory = [];
    this.updateChatUI();
  }
}

// DOM နဲ့ ချိတ်ဆက်မယ့် code
document.addEventListener('DOMContentLoaded', () => {
  const chatSystem = new ChatSystem();
  
  // Send button event
  document.getElementById('sendButton').addEventListener('click', () => {
    const userInput = document.getElementById('userInput').value;
    if(userInput.trim() !== '') {
      chatSystem.sendMessage(userInput);
    }
  });
});
