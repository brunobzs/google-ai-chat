export class MessageHandler {
  constructor(chatContainer) {
    this.chatContainer = chatContainer;
  }

  sanitizeInput(input) {
    return input.trim().replace(/<[^>]*>/g, '');
  }

  showLoadingIndicator() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot-message', 'loading');
    loadingDiv.textContent = 'Digitando...';
    this.chatContainer.appendChild(loadingDiv);
    return loadingDiv;
  }

  displayMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = message;
    this.chatContainer.appendChild(messageDiv);
    this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
  }
}