const Message = require('../../models/Message');

// @desc    Get list of conversations
// @route   GET /api/messages
// @access  Private
exports.getConversations = (req, res, next) => {
    const userId = req.user.id;
    Message.getConversations(userId, (err, conversations) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        res.status(200).json({
            success: true,
            data: conversations
        });
    });
};

// @desc    Get conversation with another user
// @route   GET /api/messages/:userId
// @access  Private
exports.getConversation = (req, res, next) => {
    const user1_id = req.user.id;
    const user2_id = req.params.userId;

    Message.getConversation(user1_id, user2_id, (err, messages) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        res.status(200).json({
            success: true,
            data: messages
        });
    });
};

// @desc    Send a message to another user
// @route   POST /api/messages/:userId
// @access  Private
exports.sendMessage = (req, res, next) => {
    const { message } = req.body;
    const sender_id = req.user.id;
    const receiver_id = req.params.userId;

    if (!message) {
        return res.status(400).json({ message: 'Please enter a message' });
    }

    const newMessage = {
        sender_id,
        receiver_id,
        message
    };

    Message.create(newMessage, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            messageId: result.insertId
        });
    });
};