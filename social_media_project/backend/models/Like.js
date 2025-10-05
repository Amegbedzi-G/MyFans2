const db = require('../config/db');

const Like = {
    add: function(data, callback) {
        return db.query(
            'INSERT INTO likes (user_id, post_id) VALUES (?, ?)',
            [data.user_id, data.post_id],
            callback
        );
    },
    remove: function(data, callback) {
        return db.query(
            'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
            [data.user_id, data.post_id],
            callback
        );
    },
    findByUserAndPost: function(data, callback) {
        return db.query(
            'SELECT * FROM likes WHERE user_id = ? AND post_id = ?',
            [data.user_id, data.post_id],
            callback
        );
    }
};

module.exports = Like;