const API_KEY = 'AIzaSyDiB-e4q5ivY0L07Yv7kUW8wdj0d__HA4E';
const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
let isProcessing = false;
let lastRequestTime = 0;
const RATE_LIMIT_DELAY = 1000; // 1 segundo entre requisições

const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Carregar tema salvo ou usar padrão
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

// Função para alternar tema
function toggleTheme() {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

themeToggle.addEventListener('click', toggleTheme);

async function googleAI(text) {
  try {
    const response = await fetch(`${API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: text.trim()
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

function toggleButtonState(isDisabled) {
  sendButton.disabled = isDisabled;
}

function sanitizeInput(input) {
  return input.trim().replace(/<[^>]*>/g, '');
}

function showLoadingIndicator() {
  const loadingDiv = document.createElement('div');
  loadingDiv.classList.add('message', 'bot-message', 'loading');
  loadingDiv.textContent = 'Digitando...';
  chatContainer.appendChild(loadingDiv);
  return loadingDiv;
}

async function handleSubmit() {
  const userMessage = sanitizeInput(userInput.value);
  
  if (!userMessage || isProcessing) return;
  
  const now = Date.now();
  if (now - lastRequestTime < RATE_LIMIT_DELAY) {
    displayMessage('Por favor, aguarde um momento antes de enviar outra mensagem.', 'system');
    return;
  }

  isProcessing = true;
  toggleButtonState(true);
  userInput.value = '';
  displayMessage(userMessage, 'user');
  
  const loadingIndicator = showLoadingIndicator();

  try {
    lastRequestTime = Date.now();
    const botReply = await googleAI(userMessage);
    loadingIndicator.remove();
    displayMessage(botReply, 'bot');
  } catch (error) {
    loadingIndicator.remove();
    displayMessage('Desculpe, ocorreu um erro ao processar sua mensagem.', 'bot');
  } finally {
    isProcessing = false;
    toggleButtonState(false);
  }
}

sendButton.addEventListener('click', handleSubmit);

userInput.addEventListener('keyup', function(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSubmit();
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