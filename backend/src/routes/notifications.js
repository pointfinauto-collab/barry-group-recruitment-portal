const express = require('express');
const router = express.Router();
const notifController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, notifController.getNotifications);
router.get('/unread', authenticate, notifController.getUnreadCount);
router.put('/:id/read', authenticate, notifController.markAsRead);

module.exports = router;
