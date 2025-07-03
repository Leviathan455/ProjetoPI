const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

//router.post('/conversations', chatbotController.startConversation);
router.post('/messages', chatbotController.processMessage);

router.get('/conversations/:conversationId', chatbotController.getHistory);

module.exports = router;