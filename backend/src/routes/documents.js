const express = require('express');
const router = express.Router();
const docController = require('../controllers/documentController');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.post('/upload', authenticate, upload.single('file'), docController.uploadDocument);
router.get('/my', authenticate, docController.getMyDocuments);
router.delete('/:id', authenticate, docController.deleteDocument);
router.get('/download/:id', authenticate, docController.downloadDocument);

// Admin
router.get('/', authenticate, requireAdmin, docController.getAllDocuments);
router.put('/:id/review', authenticate, requireAdmin, docController.reviewDocument);

module.exports = router;
