import { config } from '../config/config.js';

export class AIService {
  async generateResponse(text) {
    try {
      const response = await fetch(`${config.API_ENDPOINT}?key=${config.API_KEY}`, {
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
}