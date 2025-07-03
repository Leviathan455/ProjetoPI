const pool = require('../config/db');

module.exports = {
  async createConversation(userId) {
    const { rows } = await pool.query(
      `INSERT INTO chat_conversations (user_id) 
       VALUES ($1) 
       RETURNING *`,
      [userId]
    );
    return rows[0];
  },

  async saveMessage(conversationId, sender, message) {
    const { rows } = await pool.query(
      `INSERT INTO chat_messages (conversation_id, sender_type, message_text) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [conversationId, sender, message]
    );
    return rows[0];
  },

  async getConversationHistory(conversationId) {
    const { rows } = await pool.query(
      `SELECT * FROM chat_messages 
       WHERE conversation_id = $1 
       ORDER BY sent_at ASC`,
      [conversationId]
    );
    return rows;
  }
};