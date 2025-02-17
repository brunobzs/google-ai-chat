import { config } from './config/config.js';
import { AIService } from './services/ai-service.js';
import { ThemeManager } from './utils/theme-manager.js';
import { MessageHandler } from './utils/message-handler.js';

class App {
  constructor() {
    this.aiService = new AIService();
    this.messageHandler = new MessageHandler(document.getElementById('chat-container'));
    this.themeManager = new ThemeManager();

    this.userInput = document.getElementById('user-input');
    this.sendButton = document.getElementById('send-button');

    this.isProcessing = false;
    this.lastRequestTime = 0;

    this.clearButton = document.getElementById('clear-chat');
    this.init();
  }

  init() {
    this.sendButton.addEventListener('click', () => this.handleSubmit());
    this.userInput.addEventListener('keyup', (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        this.handleSubmit();
      }
    });
    this.clearButton.addEventListener('click', () => {
      this.messageHandler.clearHistory();
    });
  }

  toggleButtonState(isDisabled) {
    this.sendButton.disabled = isDisabled;
  }

  async handleSubmit() {
    const userMessage = this.messageHandler.sanitizeInput(this.userInput.value);

    if (!userMessage || this.isProcessing) return;

    const now = Date.now();
    if (now - this.lastRequestTime < config.RATE_LIMIT_DELAY) {
      this.messageHandler.displayMessage('Por favor, aguarde um momento antes de enviar outra mensagem.', 'system');
      return;
    }

    this.isProcessing = true;
    this.toggleButtonState(true);
    this.userInput.value = '';
    this.messageHandler.displayMessage(userMessage, 'user');

    const loadingIndicator = this.messageHandler.showLoadingIndicator();

    try {
      this.lastRequestTime = Date.now();
      const history = this.messageHandler.getHistory();
      const botReply = await this.aiService.generateResponse(userMessage, history);
      loadingIndicator.remove();
      this.messageHandler.displayMessage(botReply, 'bot');
    } catch (error) {
      loadingIndicator.remove();
      this.messageHandler.displayMessage('Desculpe, ocorreu um erro ao processar sua mensagem.', 'bot');
    } finally {
      this.isProcessing = false;
      this.toggleButtonState(false);
    }
  }
}

new App();