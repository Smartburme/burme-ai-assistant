document.addEventListener('DOMContentLoaded', () => {
    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.hyper-sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Code Generation Logic
    const generateBtn = document.querySelector('.generate-btn');
    const copyBtn = document.querySelector('.copy-btn');
    const inputTextarea = document.querySelector('.input-section textarea');
    const codeBlock = document.querySelector('.generated-code');
    const languageSelector = document.querySelector('.language-selector');

    generateBtn.addEventListener('click', generateCode);
    copyBtn.addEventListener('click', copyCode);
    languageSelector.addEventListener('change', updateCodeLanguage);

    async function generateCode() {
        const prompt = inputTextarea.value.trim();
        const language = languageSelector.value;
        
        if (!prompt) {
            alert('ကျေးဇူးပြု၍ ကုဒ်ဖန်တီးလိုသော အကြောင်းအရာတစ်ခုခုရေးသားပါ');
            return;
        }

        generateBtn.disabled = true;
        generateBtn.textContent = 'ကုဒ်ထုတ်လုပ်နေသည်...';

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Sample code responses based on language
            const codeSamples = {
                python: `# ${prompt}\ndef solution():\n    # Your code here\n    return "Hello World"`,
                javascript: `// ${prompt}\nfunction solution() {\n  // Your code here\n  return "Hello World";\n}`,
                html: `<!-- ${prompt} -->\n<div class="container">\n  <h1>Hello World</h1>\n</div>`,
                css: `/* ${prompt} */\n.container {\n  width: 100%;\n  padding: 1rem;\n}`,
                java: `// ${prompt}\npublic class Solution {\n  public static void main(String[] args) {\n    System.out.println("Hello World");\n  }\n}`
            };

            codeBlock.textContent = codeSamples[language];
            codeBlock.className = `generated-code hljs ${language}`;
            hljs.highlightElement(codeBlock);
        } catch (error) {
            codeBlock.innerHTML = '<span class="error">ကုဒ်ထုတ်လုပ်ရာတွင် အမှားတစ်ခုဖြစ်ပွားခဲ့သည်။ ကျေးဇူးပြု၍ နောက်မှထပ်ကြိုးစားပါ။</span>';
            console.error('Code generation error:', error);
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'ကုဒ်ထုတ်လုပ်ရန်';
        }
    }

    function copyCode() {
        const textToCopy = codeBlock.innerText;
        if (!textToCopy.trim()) {
            alert('ကူးယူရန် ကုဒ်မရှိပါ');
            return;
        }

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                copyBtn.textContent = 'ကူးယူပြီး!';
                setTimeout(() => {
                    copyBtn.textContent = 'ကူးယူရန်';
                }, 2000);
            })
            .catch(err => {
                console.error('Copy failed:', err);
                alert('ကုဒ်ကူးယူရာတွင် အမှားဖြစ်ပွားခဲ့သည်');
            });
    }

    function updateCodeLanguage() {
        if (codeBlock.textContent.trim()) {
            codeBlock.className = `generated-code hljs ${languageSelector.value}`;
            hljs.highlightElement(codeBlock);
        }
    }
});
