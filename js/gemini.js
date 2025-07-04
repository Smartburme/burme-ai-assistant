// js/gemini.js

// REPLACE WITH YOUR CLOUDFLARE WORKER DEPLOYED URL
const GEMINI_WORKER_URL = 'YOUR_CLOUDFLARE_WORKER_URL'; // <-- REPLACE THIS

async function getGeminiResponse(messageData) {
    if (!GEMINI_WORKER_URL || GEMINI_WORKER_URL === 'YOUR_CLOUDFLARE_WORKER_URL') {
        console.error("Cloudflare Worker URL is not configured!");
        throw new Error("Gemini API Worker not configured.");
    }

    try {
        const response = await fetch(GEMINI_WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any necessary authorization headers if your worker requires them
            },
            // messageData can be a string (for text) or an object (for text+image)
            body: JSON.stringify({ message: messageData }),
        });

        if (!response.ok) {
            let errorText = `API request failed with status ${response.status}`;
            try {
                const errorData = await response.json();
                errorText += `: ${errorData.error || response.statusText}`;
            } catch {
                errorText += `: ${response.statusText}`;
            }
            console.error("Worker API Error Response:", errorText);
            throw new Error(errorText);
        }

        const data = await response.json();
        if (data.response) {
            return data.response;
        } else {
            throw new Error("Invalid response format from Worker.");
        }

    } catch (error) {
        console.error("Error in getGeminiResponse (calling Worker):", error);
        throw error;
    }
}