const express = require('express');
const router = express.Router();
const msgController = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, msgController.sendMessage);
router.get('/inbox', authenticate, msgController.getInbox);
router.get('/unread', authenticate, msgController.getUnreadCount);
router.get('/:id/thread', authenticate, msgController.getThread);

module.exports = router;
