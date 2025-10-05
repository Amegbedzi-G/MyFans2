const Like = require('../../models/Like');

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
exports.likePost = (req, res, next) => {
    const likeData = {
        user_id: req.user.id,
        post_id: req.params.id
    };

    // Check if the user has already liked the post
    Like.findByUserAndPost(likeData, (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.length > 0) {
            return res.status(400).json({ message: 'Post already liked' });
        }

        Like.add(likeData, (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.status(201).json({ success: true, message: 'Post liked' });
        });
    });
};

// @desc    Unlike a post
// @route   DELETE /api/posts/:id/like
// @access  Private
exports.unlikePost = (req, res, next) => {
    const likeData = {
        user_id: req.user.id,
        post_id: req.params.id
    };

    Like.remove(likeData, (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Post not liked yet' });
        }
        res.status(200).json({ success: true, message: 'Post unliked' });
    });
};