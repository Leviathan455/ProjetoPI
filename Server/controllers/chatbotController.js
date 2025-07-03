const ChatbotModel = require('../models/chatbotModel');
const { generateResponse } = require('../../chatbot/services/dialogFlow');

module.exports = {
  async processMessage(req, res) {
    try {
      const { conversationId, message } = req.body;
      let convId = conversationId;

      // Se não houver conversa, cria uma nova
      if (!convId) {
        const newConversation = await ChatbotModel.createConversation(req.user.id);
        convId = newConversation.id;
      }

      // Salva a mensagem do usuário
      await ChatbotModel.saveMessage(convId, 'user', message);

      // Gera e salva resposta do bot
      const botResponse = generateResponse(message);
      await ChatbotModel.saveMessage(convId, 'bot', botResponse);

      res.json({ response: botResponse, conversationId: convId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getHistory(req, res) {
    try {
      const history = await ChatbotModel.getConversationHistory(req.params.conversationId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
