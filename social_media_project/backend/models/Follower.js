const db = require('../config/db');

const Follower = {
    follow: function(data, callback) {
        return db.query(
            'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)',
            [data.follower_id, data.following_id],
            callback
        );
    },
    unfollow: function(data, callback) {
        return db.query(
            'DELETE FROM followers WHERE follower_id = ? AND following_id = ?',
            [data.follower_id, data.following_id],
            callback
        );
    },
    isFollowing: function(data, callback) {
        return db.query(
            'SELECT * FROM followers WHERE follower_id = ? AND following_id = ?',
            [data.follower_id, data.following_id],
            callback
        );
    }
};

module.exports = Follower;