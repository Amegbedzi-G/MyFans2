const express = require('express');
const router = express.Router();
const {
    getConversations,
    getConversation,
    sendMessage
} = require('../../controllers/messages/messages');
const { protect } = require('../../middleware/auth');

// @route   GET /api/messages
// @desc    Get all conversations for a user
// @access  Private
router.get('/', protect, getConversations);

// @route   GET /api/messages/:userId
// @desc    Get conversation with a user
// @access  Private
router.get('/:userId', protect, getConversation);

// @route   POST /api/messages/:userId
// @desc    Send a message to a user
// @access  Private
router.post('/:userId', protect, sendMessage);

module.exports = router;