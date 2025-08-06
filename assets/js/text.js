class TextGenerator {
  constructor() {
    this.models = {
      'gpt-3.5-turbo': 'GPT-3.5 Turbo',
      'gpt-4': 'GPT-4',
      'claude-2': 'Claude 2'
    };
  }

  generateText(prompt, model, length) {
    // API call လုပ်မယ့် logic
    console.log(`Generating text with ${model} (${length} tokens)`);
  }
}
