document.addEventListener('DOMContentLoaded', () => {
    // Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.hyper-sidebar');
    
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Text Generation Logic
    const generateBtn = document.querySelector('.generate-btn');
    const copyBtn = document.querySelector('.copy-btn');
    const inputTextarea = document.querySelector('.input-section textarea');
    const outputDiv = document.querySelector('.generated-text');
    const styleSelector = document.querySelector('.style-selector');

    generateBtn.addEventListener('click', generateText);
    copyBtn.addEventListener('click', copyText);

    async function generateText() {
        const prompt = inputTextarea.value.trim();
        const style = styleSelector.value;
        
        if (!prompt) {
            alert('ကျေးဇူးပြု၍ စာသားတစ်ခုခုရေးသားပါ');
            return;
        }

        generateBtn.disabled = true;
        generateBtn.textContent = 'ထုတ်လုပ်နေသည်...';

        try {
            // Simulate API call (replace with actual worker call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Sample responses based on style
            const responses = {
                formal: `အထက်ပါအကြောင်းအရာအား ရေးသားရာတွင် အောက်ပါအတိုင်း အလေးအနက်ဖော်ပြနိုင်ပါသည်။\n\n${prompt}\n\nဤအကြောင်းအရာသည် အရေးပါသော ကိစ္စရပ်တစ်ခုဖြစ်ပြီး သေချာစွာ စဉ်းစားဆောင်ရွက်သင့်ပါသည်။`,
                casual: `ဟေ့ဗျာ၊ မင်းမေးတဲ့အကြောင်း ပြောကြည့်မယ်နော်။\n\n${prompt}\n\nဒါနဲ့ပတ်သက်ပြီး ငါထင်တာကတော့ ဒီလိုမျိုးဗျ။ ဘယ်လိုထင်လဲ?`,
                creative: `✨ မင်းရဲ့စိတ်ကူးက စိတ်ဝင်စားစရာကောင်းတယ်! ✨\n\n"${prompt}"\n\nဒီအကြောင်းနဲ့ပတ်သက်ပြီး ဖန်တီးမှုတစ်ခုလုပ်ကြည့်မယ်...\n\nတစ်ခါတုန်းက လူတစ်ယောက်ဟာ...`
            };

            outputDiv.innerHTML = `<p>${responses[style]}</p>`;
        } catch (error) {
            outputDiv.innerHTML = `<p class="error">စာသားထုတ်လုပ်ရာတွင် အမှားတစ်ခုဖြစ်ပွားခဲ့သည်။ ကျေးဇူးပြု၍ နောက်မှထပ်ကြိုးစားပါ။</p>`;
            console.error('Generation error:', error);
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'ထုတ်လုပ်ရန်';
        }
    }

    function copyText() {
        const textToCopy = outputDiv.innerText;
        if (!textToCopy) {
            alert('ကူးယူရန် စာသားမရှိပါ');
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
                alert('ကူးယူရာတွင် အမှားဖြစ်ပွားခဲ့သည်');
            });
    }
});
