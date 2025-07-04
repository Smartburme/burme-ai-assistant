// js/chat.js

document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessagesArea = document.getElementById('chat-messages');
    const uploadImgBtn = document.getElementById('upload-img-btn');
    const uploadVidBtn = document.getElementById('upload-vid-btn'); // Video upload button

    // Hidden file inputs
    const imageFileInput = document.createElement('input');
    imageFileInput.type = 'file';
    imageFileInput.accept = 'image/*';
    imageFileInput.style.display = 'none';
    document.body.appendChild(imageFileInput);

    const videoFileInput = document.createElement('input');
    videoFileInput.type = 'file';
    videoFileInput.accept = 'video/*';
    videoFileInput.style.display = 'none';
    document.body.appendChild(videoFileInput);

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
            imageFileInput.click(); // Trigger image file input
        });
    }

    if (uploadVidBtn) {
        uploadVidBtn.addEventListener('click', () => {
            videoFileInput.click(); // Trigger video file input
        });
    }

    // Handle image file selection
    imageFileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            await sendImageMessage(file);
            event.target.value = ''; // Clear the file input
        }
    });

    // Handle video file selection
    videoFileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            displayMessage(`[Uploading video: ${file.name}]`, 'user-message', 'video-placeholder');
            await sendVideoMessage(file);
            event.target.value = ''; // Clear the file input
        }
    });

    // --- Functions ---

    async function sendMessage() {
        let messageToSend = userInput.value.trim();
        let messageType = 'text';

        // Check for code input prefix like '/code'
        if (messageToSend.toLowerCase().startsWith('/code')) {
            messageType = 'code';
            messageToSend = messageToSend.substring(5).trim(); // Remove '/code' prefix
            if (!messageToSend) {
                alert("Please provide the code snippet after /code.");
                return;
            }
        }

        if (!messageToSend) return;

        displayMessage(messageToSend, 'user-message', messageType); // Pass messageType
        userInput.value = '';

        showBotThinkingIndicator();

        try {
            let aiResponse;
            if (messageType === 'code') {
                // Construct a prompt to guide Gemini to treat input as code
                const codePrompt = `Analyze this code snippet:\n\`\`\`javascript\n${messageToSend}\n\`\`\`\nProvide explanation, suggestions, or output.`;
                aiResponse = await getGeminiResponse(codePrompt);
            } else {
                aiResponse = await getGeminiResponse(messageToSend); // Plain text
            }

            removeBotThinkingIndicator();
            displayMessage(aiResponse, 'bot-message', 'text');

        } catch (error) {
            console.error(`Error getting AI ${messageType} response:`, error);
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
                text: textPart || "Analyze this image.", // Default prompt if no text
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

    async function sendVideoMessage(videoFile) {
        // Note: Video handling is conceptual and requires Gemini API video support and proper worker implementation.
        try {
            // Convert video to Data URL (Base64)
            // Be aware of potential size limits and performance issues with large videos.
            const videoDataUrl = await fileToDataURL(videoFile);
            const textPart = `Analyze this video: ${videoFile.name}`;

            // Construct the message payload for the worker
            const multiModalMessage = {
                type: 'text_and_video',
                text: textPart,
                videoDataUrl: videoDataUrl // Sending Data URL (requires Gemini API support and worker processing)
            };

            const aiResponse = await getGeminiResponse(multiModalMessage);
            removeBotThinkingIndicator();
            displayMessage(aiResponse, 'bot-message', 'text'); // Display AI's text response

        } catch (error) {
            console.error("Error processing video message:", error);
            removeBotThinkingIndicator();
            displayMessage(`Error processing video: ${error.message}`, 'bot-message error');
        }
    }

    // Helper to convert file to Base64 (for image)
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Get Base64 part only
            reader.onerror = error => reject(error);
        });
    }

    // Helper to convert file to Data URL (for video)
    function fileToDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result); // Keep the full Data URL
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
            img.src = message; // Message is already a data URL
            img.alt = "User Uploaded Image";
            img.classList.add('chat-image-preview');
            img.onload = () => {
                chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
            };
            messageElement.appendChild(img);
        } else if (contentType === 'video-placeholder') {
            messageElement.textContent = message;
            messageElement.style.fontStyle = 'italic';
            messageElement.style.color = '#bbb';
        } else if (contentType === 'video') { // If you want to display video player
            const videoElement = document.createElement('video');
            videoElement.src = message; // Message is a data URL for video
            videoElement.controls = true;
            videoElement.classList.add('chat-video-preview');
            videoElement.style.maxWidth = '100%';
            videoElement.style.height = 'auto';
            videoElement.style.borderRadius = '8px';
            messageElement.appendChild(videoElement);
        } else if (contentType === 'code') {
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.textContent = message;
            // Basic syntax highlighting class (can be improved with Prism.js)
            code.className = 'language-javascript';
            pre.appendChild(code);
            messageElement.appendChild(pre);
        }
        chatMessagesArea.appendChild(messageElement);
        chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
    }
});