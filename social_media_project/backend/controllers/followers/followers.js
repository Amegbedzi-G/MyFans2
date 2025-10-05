const Follower = require('../../models/Follower');

// @desc    Follow a user
// @route   POST /api/users/:id/follow
// @access  Private
exports.followUser = (req, res, next) => {
    const followData = {
        follower_id: req.user.id,
        following_id: req.params.id
    };

    // Prevent user from following themselves
    if (followData.follower_id == followData.following_id) {
        return res.status(400).json({ message: "You cannot follow yourself." });
    }

    // Check if already following
    Follower.isFollowing(followData, (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.length > 0) {
            return res.status(400).json({ message: 'Already following this user' });
        }

        Follower.follow(followData, (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.status(201).json({ success: true, message: 'User followed' });
        });
    });
};

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/follow
// @access  Private
exports.unfollowUser = (req, res, next) => {
    const followData = {
        follower_id: req.user.id,
        following_id: req.params.id
    };

    Follower.unfollow(followData, (err, result) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: 'Not following this user' });
        }
        res.status(200).json({ success: true, message: 'User unfollowed' });
    });
};