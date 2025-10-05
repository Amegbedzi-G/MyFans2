const Comment = require('../../models/Comment');

// @desc    Get all comments for a post
// @route   GET /api/posts/:id/comments
// @access  Public
exports.getComments = (req, res, next) => {
    const post_id = req.params.id;

    Comment.findByPostId(post_id, (err, comments) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        res.status(200).json({
            success: true,
            count: comments.length,
            data: comments
        });
    });
};

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
exports.addComment = (req, res, next) => {
    const { comment } = req.body;
    const post_id = req.params.id;
    const user_id = req.user.id;

    if (!comment) {
        return res.status(400).json({ message: 'Please enter a comment' });
    }

    const newComment = {
        user_id,
        post_id,
        comment
    };

    Comment.add(newComment, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        res.status(201).json({
            success: true,
            message: 'Comment added successfully',
            commentId: result.insertId
        });
    });
};