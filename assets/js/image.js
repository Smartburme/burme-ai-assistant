// BURME AI - Image Generation Module
class ImageGenerator {
  constructor() {
    this.imagePrompt = document.getElementById('imagePrompt');
    this.generatedImages = document.getElementById('generatedImages');
    this.generateBtn = document.getElementById('generateImageBtn');
    this.imageStyle = document.getElementById('imageStyle');
    this.imageRatio = document.getElementById('imageRatio');
    this.exampleCards = document.querySelectorAll('.example-card');
    this.uploadBtn = document.querySelector('.tool-btn[title="Upload reference"]');
    this.clearBtn = document.querySelector('.tool-btn[title="Clear"]');
    this.downloadAllBtn = document.querySelector('.action-btn[title="Download All"]');

    this.initEventListeners();
    this.initFileUpload();
  }

  initEventListeners() {
    this.generateBtn.addEventListener('click', () => this.generateImages());
    this.downloadAllBtn.addEventListener('click', () => this.downloadAllImages());
    this.clearBtn.addEventListener('click', () => this.clearInput());

    this.exampleCards.forEach(card => {
      card.addEventListener('click', () => {
        this.imagePrompt.value = card.dataset.prompt;
        this.generateImages();
      });
    });
  }

  initFileUpload() {
    this.uploadBtn.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.handleImageUpload(file);
        }
      });
      
      input.click();
    });
  }

  handleImageUpload(file) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      this.imagePrompt.value = `Generate an image similar to this reference: ${this.imagePrompt.value}`;
      this.showUploadedImage(e.target.result);
    };
    
    reader.readAsDataURL(file);
  }

  showUploadedImage(dataUrl) {
    const preview = document.createElement('div');
    preview.className = 'uploaded-preview';
    preview.innerHTML = `
      <img src="${dataUrl}" alt="Uploaded reference">
      <button class="remove-preview"><i class="fas fa-times"></i></button>
    `;
    
    const inputContainer = this.imagePrompt.parentElement;
    inputContainer.insertBefore(preview, this.imagePrompt.nextSibling);
    
    preview.querySelector('.remove-preview').addEventListener('click', () => {
      preview.remove();
    });
  }

  async generateImages() {
    const prompt = this.imagePrompt.value.trim();
    if (!prompt) return;

    const style = this.imageStyle.value;
    const ratio = this.imageRatio.value;
    this.showLoadingState();

    try {
      // Simulate API call (replace with actual API call)
      const imageUrls = await this.mockImageGeneration(prompt, style, ratio);
      this.displayGeneratedImages(imageUrls);
    } catch (error) {
      console.error('Image generation error:', error);
      this.showErrorState();
    } finally {
      this.hideLoadingState();
    }
  }

  async mockImageGeneration(prompt, style, ratio) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock image URLs based on parameters
    const baseUrl = 'https://source.unsplash.com/random/';
    const dimensions = {
      '1:1': '800x800',
      '16:9': '800x450',
      '9:16': '450x800'
    };

    const styleKeywords = {
      realistic: 'realistic,photography',
      anime: 'anime,illustration',
      painting: 'painting,art',
      'digital-art': 'digital+art,concept'
    };

    const query = `${prompt.split(' ').join('+')}+${styleKeywords[style]}`;
    const size = dimensions[ratio] || '800x800';

    return [
      `${baseUrl}${size}/?${query}&1`,
      `${baseUrl}${size}/?${query}&2`,
      `${baseUrl}${size}/?${query}&3`,
      `${baseUrl}${size}/?${query}&4`
    ];
  }

  displayGeneratedImages(imageUrls) {
    this.generatedImages.innerHTML = '';
    
    imageUrls.forEach((url, index) => {
      const imgContainer = document.createElement('div');
      imgContainer.className = 'generated-image';
      imgContainer.innerHTML = `
        <img src="${url}" alt="Generated image ${index + 1}">
        <div class="image-actions">
          <button class="download-btn" data-url="${url}">
            <i class="fas fa-download"></i>
          </button>
        </div>
      `;
      
      imgContainer.querySelector('.download-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.downloadImage(url);
      });
      
      this.generatedImages.appendChild(imgContainer);
    });
  }

  downloadImage(url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = `burme-ai-image-${new Date().getTime()}.jpg`;
    a.click();
    this.showToast('Image download started');
  }

  downloadAllImages() {
    const images = this.generatedImages.querySelectorAll('.generated-image');
    if (images.length === 0) return;
    
    this.showToast(`Downloading ${images.length} images...`);
    images.forEach((img, index) => {
      setTimeout(() => {
        const url = img.querySelector('img').src;
        this.downloadImage(url);
      }, index * 300);
    });
  }

  clearInput() {
    this.imagePrompt.value = '';
    const preview = document.querySelector('.uploaded-preview');
    if (preview) preview.remove();
    this.imagePrompt.focus();
  }

  showLoadingState() {
    this.generateBtn.disabled = true;
    this.generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    this.generatedImages.innerHTML = `
      <div class="loading-images">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    `;
  }

  hideLoadingState() {
    this.generateBtn.disabled = false;
    this.generateBtn.innerHTML = '<i class="fas fa-magic"></i> Generate';
  }

  showErrorState() {
    this.generatedImages.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Image generation failed. Please try again.</p>
      </div>
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
  new ImageGenerator();
});
