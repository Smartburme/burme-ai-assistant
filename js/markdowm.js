// js/markdown.js

async function loadMarkdownContent(filePath) {
    const aboutContentDiv = document.getElementById('about-content');
    if (!aboutContentDiv) {
        console.error("Element with ID 'about-content' not found.");
        return;
    }

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdownText = await response.text();

        if (typeof marked === 'undefined') {
            console.error("Markdown parser (marked.js) is not loaded.");
            aboutContentDiv.innerHTML = '<p>Error: Markdown parser not available.</p>';
            return;
        }
        // Use marked.parse for newer versions
        const htmlContent = marked.parse(markdownText);

        aboutContentDiv.innerHTML = htmlContent;
    } catch (error) {
        console.error("Error loading or parsing markdown:", error);
        aboutContentDiv.innerHTML = `<p>Failed to load project information: ${error.message}</p>`;
    }
}

// Load markdown when the about page is loaded
window.addEventListener('load', () => {
    if (document.getElementById('about-content')) {
        loadMarkdownContent('README.md');
    }
});