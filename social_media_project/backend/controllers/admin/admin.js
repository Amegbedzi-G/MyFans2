const User = require('../../models/User');
const Post = require('../../models/Post');

// @desc    Get all users (for admin)
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = (req, res, next) => {
    User.findAll((err, users) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.status(200).json({ success: true, data: users });
    });
};

// @desc    Delete a user (for admin)
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = (req, res, next) => {
    const userId = req.params.id;
    User.delete(userId, (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    });
};

// @desc    Get all posts (for admin)
// @route   GET /api/admin/posts
// @access  Admin
exports.getAllPosts = (req, res, next) => {
    Post.findAll((err, posts) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        res.status(200).json({ success: true, data: posts });
    });
};

// @desc    Delete a post (for admin)
// @route   DELETE /api/admin/posts/:id
// @access  Admin
exports.deletePostByAdmin = (req, res, next) => {
    const postId = req.params.id;
    Post.delete(postId, (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    });
};