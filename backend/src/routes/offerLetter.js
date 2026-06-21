const express = require('express');
const router = express.Router();
const { generateAndSendOffer, downloadOfferLetter, previewOfferLetter } = require('../controllers/offerLetterController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/:applicationId/generate', authenticate, requireAdmin, generateAndSendOffer);
router.get('/:applicationId/preview', authenticate, requireAdmin, previewOfferLetter);
router.get('/:applicationId/download', authenticate, downloadOfferLetter);

module.exports = router;
