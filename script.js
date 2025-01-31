async function googleAI(text) {
  const apiKey = 'AIzaSyDiB-e4q5ivY0L07Yv7kUW8wdj0d__HA4E'; // Replace with your actual API key
  const googleAIUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(googleAIUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${text}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error:', error);
    return "Error communicating with the AI."; // Return an error message
  }
}

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function toggleButtonState(isDisabled) {
  sendButton.disabled = isDisabled;
}

sendButton.addEventListener('click', async () => {
  const userMessage = userInput.value;
  displayMessage(userMessage, 'user');
  userInput.value = '';

  // Desabilita o botão enquanto aguarda a resposta da API
  toggleButtonState(true);

  try {
    const botReply = await googleAI(userMessage);
    displayMessage(botReply, 'bot');
  } catch (error) {
    console.error('Erro na requisição:', error);
    displayMessage('Erro ao obter resposta da IA.', 'bot');
  } finally {
    // Reabilita o botão após a resposta da API (ou erro)
    toggleButtonState(false);
  }
});

userInput.addEventListener('keyup', function(event) {
  if (event.key === "Enter") {
    sendButton.click();
  }
});


function displayMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', `${sender}-message`);
  messageDiv.textContent = message;
  chatContainer.appendChild(messageDiv);

  // Scroll to bottom to show the latest message
  chatContainer.scrollTop = chatContainer.scrollHeight;
}