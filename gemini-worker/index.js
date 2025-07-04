// gemini-worker/index.js - Conceptual addition for Video Handling

const { GoogleGenerativeAI } = require("@google/generative-ai");

const GEMINI_API_KEY = GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" }); // Or gemini-pro-vision

const corsHeaders = {
    "Access-Control-Allow-Origin": "*", // Restrict for production
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
};

export default {
    async fetch(request, env, ctx) {
        // ... existing CORS and method checks ...

        try {
            const body = await request.json();
            const userMessage = body.message;

            if (!userMessage) {
                return new Response(JSON.stringify({ error: "Message is required." }), {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            let GeminiRequest;

            if (typeof userMessage === 'string') {
                // Text-only input
                GeminiRequest = { contents: [{ parts: [{ text: userMessage }] }] };
            } else if (userMessage.type === 'text_and_image' && userMessage.text && userMessage.base64Image) {
                // Text and Image input
                GeminiRequest = {
                    contents: [{
                        parts: [
                            { text: userMessage.text },
                            { inlineData: { mimeType: "image/jpeg", data: userMessage.base64Image } }
                        ]
                    }],
                };
            }
            // --- VIDEO HANDLING (Conceptual & Needs API Confirmation) ---
            else if (userMessage.type === 'text_and_video' && userMessage.text && userMessage.videoDataUrl) {
                // Gemini API might accept video data in Data URL format or require conversion.
                // Example assumes Data URL format is acceptable (VERIFY THIS WITH GOOGLE DOCS).
                // The mime type needs to be correctly identified.
                const mimeType = userMessage.videoDataUrl.split(';')[0].split(':')[1]; // Extract mime type from Data URL

                // IMPORTANT: Sending large video files via Data URL in a single request might exceed limits.
                // A more robust solution might involve uploading the video to Cloudflare R2,
                // getting a public URL, and sending that URL to Gemini API if supported.

                GeminiRequest = {
                    contents: [{
                        parts: [
                            { text: userMessage.text },
                            // Placeholder for video data part. The exact structure is crucial.
                            // Refer to Google's Gemini API documentation for video input.
                            // Example might look like:
                            // { video: { url: "gs://bucket/video.mp4" } } // If using GCS
                            // OR { inlineData: { mimeType: "video/mp4", data: "BASE64_ENCODED_VIDEO_DATA" } }
                            // For simplicity, let's assume Data URL works conceptually:
                            { inlineData: { mimeType: mimeType || "video/mp4", data: userMessage.videoDataUrl.split(',')[1] } } // Split off "data:..." prefix
                        ]
                    }],
                };
            }
            // --- END VIDEO HANDLING ---
            else {
                return new Response(JSON.stringify({ error: "Unsupported message format." }), {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            // Call the Gemini API
            const result = await model.generateContent(GeminiRequest);
            const response = await result.response;
            const text = response.text(); // Extract text from the response

            return new Response(JSON.stringify({ response: text }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });

        } catch (error) {
            console.error("Error in Gemini Worker:", error);
            let errorMessage = "An internal error occurred.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            return new Response(JSON.stringify({ error: `Failed to get Gemini response: ${errorMessage}` }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }
    },
};
