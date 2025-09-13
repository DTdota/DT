let enterPressEnabled = true;

// Function to query the chatbot API
async function queryOllama(prompt) {
    let fullResponse = '';

    try {
        const response = await axios.post("http://127.0.0.1:8080/api/generate", {
            model: "llama3.1:8b",
            prompt: prompt,
        });

        if (response.data) {
            const responseData = response.data.split('\n'); // Split the response into chunks
            responseData.forEach(chunk => {
                if (chunk) {
                    const parsedChunk = JSON.parse(chunk);
                    fullResponse += parsedChunk.response;
                    if (parsedChunk.done) {
                        console.log("Full Response:", fullResponse);
                    }
                }
            });
        }
    } catch (error) {
        console.error("Error:", error.message);
        fullResponse = "Sorry, I couldn't understand that.";
    }

    return fullResponse || "Sorry, I couldn't understand that.";
}

// Function to handle user input and send the query
async function sendQuery() {
    const userInput = document.getElementById('userInput');
    const chatbox = document.getElementById('chatbox-container');

    if (userInput.value.trim() !== '') {
        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'message sent';
        userMessage.style.display = 'flex';
        userMessage.style.alignItems = 'flex-start';
        userMessage.style.gap = '0.5rem';
        userMessage.style.justifyContent = 'flex-end';
        userMessage.innerHTML = `
            <div class="chat-bubble" style="background-color: var(--secondary); color: var(--light); padding: 0.8rem 1.2rem; border-radius: 10px 10px 0 10px; font-size: 0.9rem; line-height: 1.4; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                ${userInput.value}
            </div>
            <img src="image/c3.png" alt="User Avatar" style="width: 40px; height: 40px; border-radius: 50%; box-shadow: var(--shadow);" />
        `;
        chatbox.appendChild(userMessage);

        // Call chatbot API and display AI response
        const aiMessage = document.createElement('div');
        aiMessage.className = 'message received';
        aiMessage.style.display = 'flex';
        aiMessage.style.alignItems = 'flex-start';
        aiMessage.style.gap = '0.5rem';
        aiMessage.innerHTML = `
            <img src="image/c2.png" alt="AI Avatar" style="width: 40px; height: 40px; border-radius: 50%; box-shadow: var(--shadow);" />
            <div class="chat-bubble" style="background-color: var(--primary); color: var(--light); padding: 0.8rem 1.2rem; border-radius: 10px 10px 10px 0; font-size: 0.9rem; line-height: 1.4; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <span class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </span>
            </div>
        `;
        chatbox.appendChild(aiMessage);
        chatbox.scrollTop = chatbox.scrollHeight;
        // Fetch AI response
        const response = await queryOllama(userInput.value);

        // Update AI message with the response
        const aiBubble = aiMessage.querySelector('.chat-bubble');
        aiBubble.innerHTML = response;

        // Clear input
        userInput.value = '';
        chatbox.scrollTop = chatbox.scrollHeight;
    }
}

// Function to enable or disable chat input
function toggleChat(enable) {
    const submitButton = document.getElementById("submitButton");
    submitButton.disabled = !enable;
    submitButton.classList.toggle("disabled", !enable);
    enterPressEnabled = enable;
}

// Function to create a typewriter effect for bot responses
function typeWriterEffect(element, text, callback) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 20);
            scrollToBottom();
        } else if (callback) {
            callback(); // Call the callback function if provided
        }
    }
    type();
}

// Function to scroll the chatbox to the bottom
function scrollToBottom() {
    const chatContainer = document.getElementById("chatbox-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Add event listener for Enter key press
document.getElementById("userInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter" && enterPressEnabled) {
        event.preventDefault();
        sendQuery();
        scrollToBottom();
    }
});