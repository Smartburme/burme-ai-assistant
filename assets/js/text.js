// BURME AI - Text Generation Module
class TextGenerator {
  constructor() {
    this.textPrompt = document.getElementById('textPrompt');
    this.generatedText = document.getElementById('generatedText');
    this.generateBtn = document.getElementById('generateTextBtn');
    this.textStyle = document.getElementById('textStyle');
    this.templateCards = document.querySelectorAll('.template-card');
    this.copyBtn = document.querySelector('.action-btn[title="Copy"]');
    this.downloadBtn = document.querySelector('.action-btn[title="Download"]');
    this.saveBtn = document.querySelector('.action-btn[title="Save"]');
    this.clearBtn = document.querySelector('.tool-btn[title="Clear"]');
    this.exampleBtn = document.querySelector('.tool-btn[title="Add example"]');

    this.initEventListeners();
  }

  initEventListeners() {
    this.generateBtn.addEventListener('click', () => this.generateText());
    this.copyBtn.addEventListener('click', () => this.copyText());
    this.downloadBtn.addEventListener('click', () => this.downloadText());
    this.saveBtn.addEventListener('click', () => this.saveText());
    this.clearBtn.addEventListener('click', () => this.clearText());
    this.exampleBtn.addEventListener('click', () => this.addExample());

    this.templateCards.forEach(card => {
      card.addEventListener('click', () => {
        this.textPrompt.value = card.dataset.prompt;
        this.generateText();
      });
    });

    this.textPrompt.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        this.generateText();
      }
    });
  }

  async generateText() {
    const prompt = this.textPrompt.value.trim();
    if (!prompt) return;

    const style = this.textStyle.value;
    this.showLoadingState();

    try {
      // Simulate API call (replace with actual API call)
      const generatedContent = await this.mockTextGeneration(prompt, style);
      this.displayGeneratedText(generatedContent);
    } catch (error) {
      console.error('Text generation error:', error);
      this.showErrorState();
    } finally {
      this.hideLoadingState();
    }
  }

  async mockTextGeneration(prompt, style) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const styles = {
      creative: `**Creative Writing**\n\nHere's a creative piece about "${prompt}":\n\n` +
               `The golden sun rose over the ancient land, casting long shadows across the pagodas. ` +
               `In the distance, the sound of temple bells mingled with the morning chorus of birds. ` +
               `"${prompt}" was more than just words—it was a feeling, a memory, a story waiting to be told.\n\n` +
               `The air smelled of jasmine and possibility...`,

      formal: `**Formal Document**\n\nRegarding the subject of "${prompt}", the following points should be considered:\n\n` +
              `1. Introduction: ${prompt} represents a significant topic in contemporary discourse.\n` +
              `2. Analysis: Current research indicates several key factors related to this matter.\n` +
              `3. Conclusion: Therefore, it is recommended that further examination be undertaken.`,

      casual: `**Casual Response**\n\nHey there! You asked about "${prompt}"—here's what I think:\n\n` +
              `That's actually a really interesting topic! From what I know, ${prompt.toLowerCase()} is pretty cool because...\n\n` +
              `Anyway, hope that helps! Let me know if you want more details.`,

      academic: `**Academic Paper Excerpt**\n\n${prompt}: A Critical Analysis\n\n` +
                `Abstract: This paper examines the phenomenon of ${prompt} through multiple theoretical lenses. ` +
                `Methodological approaches included qualitative analysis of primary sources (N=42). ` +
                `Results indicate three primary findings...`
    };

    return styles[style] || `Here is your generated text about "${prompt}":\n\n` +
                           `This is a standard response. The topic "${prompt}" could be explored in many ways ` +
                           `depending on the context and specific requirements.`;
  }

  displayGeneratedText(content) {
    this.generatedText.innerHTML = this.formatContent(content);
    this.generatedText.scrollIntoView({ behavior: 'smooth' });
  }

  formatContent(text) {
    // Simple markdown formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  copyText() {
    if (!this.generatedText.textContent.trim()) return;
    
    navigator.clipboard.writeText(this.generatedText.textContent)
      .then(() => {
        this.showToast('Text copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        this.showToast('Failed to copy text');
      });
  }

  downloadText() {
    const content = this.generatedText.textContent;
    if (!content.trim()) return;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `burme-ai-generated-text-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  saveText() {
    // In a real app, this would save to user's account/history
    this.showToast('Text saved to your history');
  }

  clearText() {
    this.textPrompt.value = '';
    this.generatedText.innerHTML = '<p class="placeholder-text">Your generated content will appear here...</p>';
    this.textPrompt.focus();
  }

  addExample() {
    const examples = [
      "A formal letter requesting a meeting with the director",
      "Poem about the beauty of Inle Lake at sunrise",
      "300-word blog post about AI advancements in Myanmar",
      "Creative story about a time-traveling merchant in ancient Bagan"
    ];
    this.textPrompt.value = examples[Math.floor(Math.random() * examples.length)];
    this.textPrompt.focus();
  }

  showLoadingState() {
    this.generateBtn.disabled = true;
    this.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    this.generatedText.innerHTML = '<div class="loading-animation"><div></div><div></div><div></div></div>';
  }

  hideLoadingState() {
    this.generateBtn.disabled = false;
    this.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate';
  }

  showErrorState() {
    this.generatedText.innerHTML = `
      <p class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        Failed to generate text. Please try again later.
      </p>
    `;
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
  new TextGenerator();
});
