const db = require('../config/db');

const Comment = {
    add: function(data, callback) {
        return db.query(
            'INSERT INTO comments (user_id, post_id, comment) VALUES (?, ?, ?)',
            [data.user_id, data.post_id, data.comment],
            callback
        );
    },
    findByPostId: function(post_id, callback) {
        // Join with users table to get username
        return db.query(
            'SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC',
            [post_id],
            callback
        );
    }
};

module.exports = Comment;