const express = require('express');
const router = express.Router();
const { purchasePost, getPurchasedPosts } = require('../../controllers/payments/payments');
const { protect } = require('../../middleware/auth');

// @route   GET /api/payments/purchased/posts
// @desc    Get IDs of posts purchased by the user
// @access  Private
router.get('/purchased/posts', protect, getPurchasedPosts);

// @route   POST /api/payments/purchase/post/:postId
// @desc    Purchase a premium post
// @access  Private
router.post('/purchase/post/:postId', protect, purchasePost);

module.exports = router;