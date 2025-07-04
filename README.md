# Burmese AI Assistant

Welcome to the Burmese AI Assistant! This project provides a modern web interface powered by Firebase Authentication for user management and Cloudflare Workers with Google's Gemini API for AI capabilities (text and image processing).

## Features

*   **Secure Authentication:** User registration, login, and password reset via Firebase Auth.
*   **AI Chat Interface:** Engage with an AI assistant for text-based responses.
*   **Image Analysis:** Upload images and receive AI analysis or descriptions.
*   **Modern UI:** Responsive design with a neon-inspired aesthetic.
*   **About & Privacy Pages:** Project information and policy details.

## Technology Stack

*   **Frontend:** HTML, CSS, JavaScript
*   **Backend/API:** Firebase Authentication, Cloudflare Workers, Google Gemini API
*   **Styling:** Custom CSS with CSS Variables for theming.

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd burme-ai-assistant
    ```

2.  **Firebase Setup:**
    *   Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/).
    *   Register a web app in your Firebase project settings and copy the `firebaseConfig` object.
    *   Replace the placeholder values in `js/firebaseConfig.js` with your actual Firebase configuration.
    *   Enable Email/Password authentication in your Firebase project's Authentication section.

3.  **Cloudflare Worker Setup:**
    *   Sign up for a Cloudflare account at [https://www.cloudflare.com/](https://www.cloudflare.com/).
    *   Install Wrangler CLI: `npm install -g wrangler`
    *   Login to Cloudflare: `wrangler login`
    *   Create a new directory named `gemini-worker`.
    *   Inside `gemini-worker`, create `index.js` and paste the provided Worker code.
    *   In the `burme-ai-assistant` root directory, create `wrangler.toml` and paste the Worker configuration.
    *   **Crucially:** In `wrangler.toml`, set your `GEMINI_API_KEY` environment variable with your actual Google Gemini API Key obtained from Google AI Studio or Google Cloud.
    *   Install worker dependencies: `cd gemini-worker && npm init -y && npm install @google/generative-ai @cloudflare/workers-types && cd ..`
    *   Deploy the worker: `wrangler deploy --config wrangler.toml`
    *   Copy the deployed Worker URL.
    *   Replace `YOUR_CLOUDFLARE_WORKER_URL` in `js/gemini.js` with your Worker's URL.

4.  **Add App Icon:**
    Place your app icon (e.g., `icon.jpg`) in the `assets/` folder.

5.  **Configure `.gitignore`:**
    Create a `.gitignore` file in the root directory with the following content:
    ```
    # Ignore Node modules
    node_modules/

    # Ignore environment files if you use them locally
    .env

    # Ignore build artifacts if any
    dist/
    ```

6.  **Deploy to Firebase Hosting:**
    *   Install Firebase CLI: `npm install -g firebase-tools`
    *   Login to Firebase: `firebase login`
    *   Initialize Firebase in your project root: `firebase init`
        *   Select "Hosting: Configure files for Firebase Hosting..."
        *   Choose your Firebase project.
        *   For the public directory, enter **"."** (dot) as your project files are in the root.
        *   Answer "No" to configuring as a single-page app.
    *   Deploy: `firebase deploy --only hosting`

## Usage

1.  Navigate to your Firebase Hosting URL.
2.  You'll be redirected to the login page if not authenticated.
3.  Register a new account or log in.
4.  Start chatting with the AI! You can send text messages or upload images.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.
