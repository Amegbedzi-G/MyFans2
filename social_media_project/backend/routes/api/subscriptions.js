const express = require('express');
const router = express.Router();
const { subscribeToCreator } = require('../../controllers/subscriptions/subscriptions');
const { protect } = require('../../middleware/auth');

// @route   POST /api/subscriptions/subscribe/:creatorId
// @desc    Subscribe to a creator
// @access  Private
router.post('/subscribe/:creatorId', protect, subscribeToCreator);

module.exports = router;