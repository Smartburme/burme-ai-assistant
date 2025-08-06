# BURME AI Project Structure
===========================

📁 burme-ai/
│
├── 📄 index.html             # Entry point with loader, menu, favicon
│
├── 📁 src/
│   └── 📁 Pages/
│       ├── main.html        # Main chat interface
│       ├── text.html        # Text generation UI
│       ├── image.html       # Image generation UI
│       ├── coder.html       # Code generation page
│       ├── setting.html     # App settings
│       ├── about.html       # About BURME AI
│       └── api.html         # API key generation & input
│
├── 📁 assets/
│   ├── 📁 js/
│   │   ├── main.js          # Main chat logic
│   │   ├── text.js          # Text generation logic
│   │   ├── image.js         # Image generation logic
│   │   ├── coder.js         # Coder tool logic
│   │   ├── setting.js       # Settings handlers
│   │   └── api.js           # API Key logic (storage/input)
│   │
│   ├── 📁 css/
│   │   ├── style.css        # Global styles
│   │   ├── generate.css     # Generation related styles
│   │   ├── setting.css      # Settings page styles
│   │   └── api.css          # API Key section styles
│   │
│   └── 📁 image/
│       └── logo.png         # Logo icon for site and app icon
│
├── 📄 worker.js             # Cloudflare Worker script for backend/API handling
├── 📄 wrangler.toml         # Cloudflare config for deployment
└── 📄 README.md             # Project overview & setup guide


💡 index.html should include:
-----------------------------
- Loader div (`#loader`)
- Sidebar menu (New Chat, Text Generate, Image Generate, Coder, API, History)
- Iframe or dynamic container to load pages from `src/Pages/*.html`
- Favicon / app icon setup:
```html
<link rel="icon" href="./assets/image/logo.png" type="image/png">
<link rel="apple-touch-icon" href="./assets/image/logo.png">
<meta name="theme-color" content="#000000">
```

💡 Menu UI Suggestion:
----------------------
- Mobile-friendly slide in/out menu
- Toggle on click
- Icons for each menu item (Font Awesome or custom SVG)

💡 API Storage Suggestion:
--------------------------
Use `localStorage` in `api.js` to store API Keys securely in the browser (not production-secure, but good for local UI)

If you want, I can start writing actual `index.html` + loader + sidebar + icon-ready HTML next.
