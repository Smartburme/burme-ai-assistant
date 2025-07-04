// js/chat.js

document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessagesArea = document.getElementById('chat-messages');
    const uploadImgBtn = document.getElementById('upload-img-btn');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // Accept only image files
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);

    // Check if user is authenticated
    if (!auth || !auth.currentUser) {
        console.warn("User not authenticated. Redirecting to login...");
        window.location.href = 'login.html';
        return;
    }

    // --- Event Listeners ---
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    if (uploadImgBtn) {
        uploadImgBtn.addEventListener('click', () => {
            fileInput.click(); // Trigger hidden file input
        });
    }

    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            await sendImageMessage(file);
            event.target.value = ''; // Clear the file input
        }
    });

    // --- Functions ---
    async function sendMessage() {
        const messageText = userInput.value.trim();
        if (!messageText) return;

        displayMessage(messageText, 'user-message', 'text');
        userInput.value = ''; // Clear input

        showBotThinkingIndicator();

        try {
            const aiResponse = await getGeminiResponse(messageText); // Plain text
            removeBotThinkingIndicator();
            displayMessage(aiResponse, 'bot-message', 'text');
        } catch (error) {
            console.error("Error getting AI text response:", error);
            removeBotThinkingIndicator();
            displayMessage(`Error: ${error.message}`, 'bot-message error');
        }
    }

    async function sendImageMessage(imageFile) {
        displayImagePreview(imageFile); // Show user's image preview

        showBotThinkingIndicator();

        try {
            const base64Image = await fileToBase64(imageFile);
            const textPart = userInput.value.trim(); // Any accompanying text

            // Prepare message for Gemini API (text + image)
            const multiModalMessage = {
                type: 'text_and_image',
                text: textPart || "Analyze this image.", // Default prompt
                base64Image: base64Image
            };

            const aiResponse = await getGeminiResponse(multiModalMessage);
            removeBotThinkingIndicator();
            displayMessage(aiResponse, 'bot-message', 'text');

        } catch (error) {
            console.error("Error processing image message:", error);
            removeBotThinkingIndicator();
            displayMessage(`Error processing image: ${error.message}`, 'bot-message error');
        }
    }

    // Helper to convert file to Base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Get Base64 part only
            reader.onerror = error => reject(error);
        });
    }

    // Function to display messages in the chat area
    function displayMessage(message, type, contentType = 'text') {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);

        if (contentType === 'text') {
            messageElement.textContent = message;
        } else if (contentType === 'image') {
            const img = document.createElement('img');
            img.src = `data:image/jpeg;base64,${message}`; // Assuming message is Base64
            img.alt = "User Uploaded Image";
            img.classList.add('chat-image-preview');
            img.onload = () => {
                chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
            };
            messageElement.appendChild(img);
        }
        chatMessagesArea.appendChild(messageElement);
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
    }

    // Helper to display a preview of the image the user selected
    function displayImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            displayMessage(imageUrl, 'user-message', 'image');
        };
        reader.readAsDataURL(file);
    }
});