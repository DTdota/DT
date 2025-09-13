let enterPressEnabled = true;

// Function to query the Gemini API
async function queryGemini(prompt) {
    const API_KEY = 'AIzaSyDs3ZScRVkYAqWFclAONwNhmc5X6gVfmDQ'; // Replace with your actual Gemini API key
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    
    let fullResponse = '';

    try {
        console.log('Sending request to Gemini API...');
        const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Raw API Response:', response.data);

        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            const candidate = response.data.candidates[0];
            if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                fullResponse = candidate.content.parts[0].text;
                console.log("Processed Response:", fullResponse);
            } else {
                console.error("No content in response parts");
                fullResponse = "I apologize, but I couldn't generate a proper response.";
            }
        } else {
            console.error("No candidates in response");
            fullResponse = "I apologize, but I couldn't generate a response at this time.";
        }
    } catch (error) {
        console.error("Error details:", error.response ? error.response.data : error.message);
        fullResponse = "Sorry, I encountered an error while processing your request.";
    }

    return fullResponse;
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

        // Call Gemini API and display AI response
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
        // Fetch AI response from Gemini
        const response = await queryGemini(userInput.value);

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