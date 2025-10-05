const express = require('express');
const router = express.Router();
const {
    followUser,
    unfollowUser
} = require('../../controllers/followers/followers');
const { protect } = require('../../middleware/auth');

// @route   POST /api/users/:id/follow
// @desc    Follow a user
// @access  Private
router.post('/:id/follow', protect, followUser);

// @route   DELETE /api/users/:id/follow
// @desc    Unfollow a user
// @access  Private
router.delete('/:id/follow', protect, unfollowUser);

module.exports = router;