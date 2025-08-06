// BURME AI - Code Generation Module
class CodeGenerator {
  constructor() {
    this.codePrompt = document.getElementById('codePrompt');
    this.generatedCode = document.getElementById('generatedCode');
    this.languageSelect = document.getElementById('languageSelect');
    this.generateBtn = document.getElementById('generateCodeBtn');
    this.explainBtn = document.getElementById('explainCodeBtn');
    this.templateCards = document.querySelectorAll('.template-card');
    this.copyBtn = document.querySelector('.action-btn[title="Copy"]');
    this.runBtn = document.querySelector('.action-btn[title="Run"]');
    this.saveBtn = document.querySelector('.action-btn[title="Save"]');
    this.clearBtn = document.querySelector('.tool-btn[title="Clear"]');
    this.exampleBtn = document.querySelector('.tool-btn[title="Add example"]');
    this.explanationContent = document.getElementById('explanationContent');
    this.collapseBtn = document.querySelector('.collapse-btn');

    this.initEventListeners();
    this.initHighlighting();
  }

  initEventListeners() {
    this.generateBtn.addEventListener('click', () => this.generateCode());
    this.explainBtn.addEventListener('click', () => this.explainCode());
    this.copyBtn.addEventListener('click', () => this.copyCode());
    this.runBtn.addEventListener('click', () => this.runCode());
    this.saveBtn.addEventListener('click', () => this.saveCode());
    this.clearBtn.addEventListener('click', () => this.clearCode());
    this.exampleBtn.addEventListener('click', () => this.addExample());

    this.templateCards.forEach(card => {
      card.addEventListener('click', () => {
        this.codePrompt.value = card.dataset.prompt;
        this.generateCode();
      });
    });

    this.collapseBtn.addEventListener('click', () => this.toggleExplanation());

    this.languageSelect.addEventListener('change', () => {
      if (this.generatedCode.textContent.trim()) {
        this.highlightCode();
      }
    });
  }

  initHighlighting() {
    hljs.highlightAll();
  }

  async generateCode() {
    const prompt = this.codePrompt.value.trim();
    if (!prompt) return;

    const language = this.languageSelect.value;
    this.showLoadingState();

    try {
      // Simulate API call (replace with actual API call)
      const { code, explanation } = await this.mockCodeGeneration(prompt, language);
      this.displayGeneratedCode(code, language);
      this.displayExplanation(explanation);
    } catch (error) {
      console.error('Code generation error:', error);
      this.showErrorState();
    } finally {
      this.hideLoadingState();
    }
  }

  async mockCodeGeneration(prompt, language) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock code generation based on language
    const codeExamples = {
      python: `# ${prompt}\ndef solution():\n    """\n    This function implements ${prompt.toLowerCase()}\n    """\n    # Initialize variables\n    result = []\n    \n    # Main logic\n    for i in range(10):\n        if i % 2 == 0:\n            result.append(i)\n    \n    return result\n\n# Example usage\nprint(solution())`,
      
      javascript: `// ${prompt}\nfunction solution() {\n  /**\n   * This function implements ${prompt.toLowerCase()}\n   */\n  // Initialize variables\n  const result = [];\n  \n  // Main logic\n  for (let i = 0; i < 10; i++) {\n    if (i % 2 === 0) {\n      result.push(i);\n    }\n  }\n  \n  return result;\n}\n\n// Example usage\nconsole.log(solution());`,
      
      html: `<!-- ${prompt} -->\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${prompt}</title>\n  <style>\n    .container {\n      max-width: 800px;\n      margin: 0 auto;\n      padding: 20px;\n    }\n  </style>\n</head>\n<body>\n  <div class="container">\n    <h1>${prompt}</h1>\n    <p>This HTML template demonstrates ${prompt.toLowerCase()}.</p>\n  </div>\n</body>\n</html>`,
      
      css: `/* ${prompt} */\n.container {\n  /* Main container styling */\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 20px;\n  display: flex;\n  flex-direction: column;\n}\n\n.header {\n  /* Header styling for ${prompt.toLowerCase()} */\n  font-size: 2rem;\n  color: #333;\n  margin-bottom: 1rem;\n}\n\n.button {\n  /* Button styling */\n  background-color: #4f46e5;\n  color: white;\n  padding: 0.5rem 1rem;\n  border-radius: 0.25rem;\n  cursor: pointer;\n}`
    };

    const explanations = {
      python: `This Python code demonstrates ${prompt.toLowerCase()}. The function 'solution()' contains the main logic that:\n\n1. Initializes an empty list\n2. Iterates through numbers 0 to 9\n3. Appends even numbers to the result list\n4. Returns the final result\n\nTime complexity: O(n) where n is the input size.`,
      
      javascript: `This JavaScript implementation handles ${prompt.toLowerCase()} by:\n\n1. Creating a function that returns an array\n2. Using a for-loop to iterate from 0 to 9\n3. Checking for even numbers using modulus operator\n4. Building the result array\n\nThe code follows ES6 standards and has O(n) complexity.`,
      
      html: `This HTML template creates a basic page structure for ${prompt.toLowerCase()} featuring:\n\n1. Proper document type and meta tags\n2. Semantic HTML5 structure\n3. Responsive viewport settings\n4. A container div with sample content\n\nAdd your CSS and JS files to extend functionality.`,
      
      css: `These CSS rules style elements for ${prompt.toLowerCase()} with:\n\n1. A centered container with max-width\n2. Flexbox layout for modern alignment\n3. Responsive padding and margins\n4. Example header and button styles\n\nCustomize colors and sizes to match your design system.`
    };

    return {
      code: codeExamples[language] || `// Code for ${prompt}\n// Language: ${language}\n// Implement your solution here`,
      explanation: explanations[language] || `This code demonstrates ${prompt.toLowerCase()} in ${language}.`
    };
  }

  displayGeneratedCode(code, language) {
    this.generatedCode.textContent = code;
    this.generatedCode.className = `hljs language-${language}`;
    this.highlightCode();
  }

  highlightCode() {
    hljs.highlightElement(this.generatedCode);
  }

  async explainCode() {
    const code = this.generatedCode.textContent.trim();
    if (!code) return;

    this.showExplanationLoading();

    try {
      // Simulate API call for explanation
      const explanation = await this.mockCodeExplanation(code);
      this.displayExplanation(explanation);
    } catch (error) {
      console.error('Explanation error:', error);
      this.showExplanationError();
    }
  }

  async mockCodeExplanation(code) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return `This code:\n\n1. Implements a solution for the given problem\n2. Uses standard patterns for the language\n3. Has good readability and maintainability\n4. Follows best practices\n\nKey functions:\n- main() - Entry point\n- helper() - Does specific calculations\n\nTime complexity: O(n log n) in average case.`;
  }

  displayExplanation(explanation) {
    this.explanationContent.innerHTML = explanation
      .replace(/\n/g, '<br>')
      .replace(/- (.*?)(<br>|$)/g, '• $1$2');
  }

  copyCode() {
    const code = this.generatedCode.textContent;
    if (!code.trim()) return;
    
    navigator.clipboard.writeText(code)
      .then(() => {
        this.showToast('Code copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        this.showToast('Failed to copy code');
      });
  }

  runCode() {
    const code = this.generatedCode.textContent;
    if (!code.trim()) return;
    
    this.showToast('Running code in sandbox... (simulated)');
    // In a real app, this would use a code execution API or sandbox
  }

  saveCode() {
    const code = this.generatedCode.textContent;
    if (!code.trim()) return;
    
    this.showToast('Code saved to your snippets');
    // In a real app, this would save to user's account
  }

  clearCode() {
    this.codePrompt.value = '';
    this.generatedCode.textContent = '';
    this.explanationContent.innerHTML = '<p>Code explanations will appear here...</p>';
    this.codePrompt.focus();
  }

  addExample() {
    const examples = [
      "Python function to calculate factorial",
      "JavaScript promise-based API call",
      "HTML form with validation",
      "CSS grid layout for dashboard"
    ];
    this.codePrompt.value = examples[Math.floor(Math.random() * examples.length)];
    this.codePrompt.focus();
  }

  toggleExplanation() {
    const content = this.explanationContent;
    const btnIcon = this.collapseBtn.querySelector('i');
    
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      btnIcon.classList.remove('fa-chevron-up');
      btnIcon.classList.add('fa-chevron-down');
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
      btnIcon.classList.remove('fa-chevron-down');
      btnIcon.classList.add('fa-chevron-up');
    }
  }

  showLoadingState() {
    this.generateBtn.disabled = true;
    this.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    this.generatedCode.textContent = '// Generating code...\n// Please wait...';
    this.highlightCode();
  }

  hideLoadingState() {
    this.generateBtn.disabled = false;
    this.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate';
  }

  showExplanationLoading() {
    this.explainBtn.disabled = true;
    this.explainBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Explaining...';
    this.explanationContent.innerHTML = '<p>Analyzing code...</p>';
  }

  showExplanationError() {
    this.explanationContent.innerHTML = `
      <p class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        Failed to generate explanation
      </p>
    `;
    this.explainBtn.disabled = false;
    this.explainBtn.innerHTML = '<i class="fas fa-question-circle"></i> Explain';
  }

  showErrorState() {
    this.generatedCode.textContent = '// Error generating code\n// Please try again later';
    this.highlightCode();
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    }, 10);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new CodeGenerator();
});
