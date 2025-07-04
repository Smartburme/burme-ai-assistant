// js/gemini.js

// Cloudflare Worker URL - HTTPS ထည့်ပါ
const GEMINI_WORKER_URL = 'https://burme-ai-assistant.mysvm.workers.dev';

async function getGeminiResponse(messageData) {
    // URL validation ကို ပိုမိုကောင်းမွန်စွာ စစ်ဆေးခြင်း
    if (!GEMINI_WORKER_URL || !GEMINI_WORKER_URL.startsWith('https://')) {
        console.error("Cloudflare Worker URL is not properly configured!");
        throw new Error("Invalid Gemini API Worker URL configuration.");
    }

    try {
        const response = await fetch(GEMINI_WORKER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ 
                message: messageData 
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.error || response.statusText;
            console.error(`API request failed: ${response.status} - ${errorMessage}`);
            throw new Error(`API Error: ${response.status} - ${errorMessage}`);
        }

        const data = await response.json();
        
        if (!data || !data.response) {
            console.error("Invalid response format:", data);
            throw new Error("Received invalid response format from Worker");
        }

        return data.response;

    } catch (error) {
        console.error("Failed to get Gemini response:", error);
        throw new Error(`Failed to communicate with Gemini Worker: ${error.message}`);
    }
}
