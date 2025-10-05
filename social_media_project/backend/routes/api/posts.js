const express = require('express');
const router = express.Router();
const {
    getPosts,
    createPost,
    updatePost,
    deletePost
} = require('../../controllers/posts/posts');
const { likePost, unlikePost } = require('../../controllers/likes/likes');
const { getComments, addComment } = require('../../controllers/comments/comments');
const { protect } = require('../../middleware/auth');

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', getPosts);

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post('/', protect, createPost);

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', protect, updatePost);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', protect, deletePost);

// Like routes
router.route('/:id/like')
    .post(protect, likePost)
    .delete(protect, unlikePost);

// Comment routes
router.route('/:id/comments')
    .get(getComments)
    .post(protect, addComment);

module.exports = router;