document.addEventListener('DOMContentLoaded', () => {
    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.hyper-sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Image Generation Logic
    const generateBtn = document.querySelector('.generate-btn');
    const inputTextarea = document.querySelector('.input-section textarea');
    const outputDiv = document.querySelector('.generated-images');
    const styleSelector = document.querySelector('.style-selector');

    generateBtn.addEventListener('click', generateImage);

    async function generateImage() {
        const prompt = inputTextarea.value.trim();
        const style = styleSelector.value;
        
        if (!prompt) {
            alert('ကျေးဇူးပြု၍ ပုံဖော်လိုသော အကြောင်းအရာတစ်ခုခုရေးသားပါ');
            return;
        }

        generateBtn.disabled = true;
        generateBtn.textContent = 'ပုံထုတ်လုပ်နေသည်...';
        outputDiv.innerHTML = '<div class="loading-spinner"></div>';

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2500));
            
            // Placeholder for actual image generation
            outputDiv.innerHTML = `
                <div class="image-result">
                    <img src="https://via.placeholder.com/512x512/8e2de2/ffffff?text=${encodeURIComponent(prompt)}" alt="Generated Image">
                    <div class="image-actions">
                        <button class="download-btn">ဒေါင်းလုဒ်ရန်</button>
                    </div>
                </div>
            `;
            
            // Add download functionality
            document.querySelector('.download-btn').addEventListener('click', () => {
                alert('ဒေါင်းလုဒ်လုပ်ရန် လုပ်ဆောင်ချက်ကို နောက်ပိုင်းတွင် ထည့်သွင်းမည်');
            });
        } catch (error) {
            outputDiv.innerHTML = '<p class="error">ပုံထုတ်လုပ်ရာတွင် အမှားတစ်ခုဖြစ်ပွားခဲ့သည်။ ကျေးဇူးပြု၍ နောက်မှထပ်ကြိုးစားပါ။</p>';
            console.error('Image generation error:', error);
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'ပုံထုတ်လုပ်ရန်';
        }
    }
});
