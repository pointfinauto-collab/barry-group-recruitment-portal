const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', jobController.getPublishedJobs);
router.get('/departments', jobController.getDepartments);
router.get('/:id', jobController.getJobById);

// Admin
router.get('/admin/all', authenticate, requireAdmin, jobController.getAllJobsAdmin);
router.post('/', authenticate, requireAdmin, jobController.createJob);
router.put('/:id', authenticate, requireAdmin, jobController.updateJob);
router.delete('/:id', authenticate, requireAdmin, jobController.deleteJob);

module.exports = router;
