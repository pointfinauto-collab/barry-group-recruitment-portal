const express = require('express');
const router = express.Router();
const appController = require('../controllers/applicationController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/', authenticate, appController.submitApplication);
router.get('/my', authenticate, appController.getMyApplication);
router.get('/:id', authenticate, appController.getApplicationById);

// Admin
router.get('/', authenticate, requireAdmin, appController.getAllApplications);
router.put('/:id/status', authenticate, requireAdmin, appController.updateApplicationStatus);

module.exports = router;
