const db = require('../config/db');

const Message = {
    create: function(data, callback) {
        return db.query(
            'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
            [data.sender_id, data.receiver_id, data.message],
            callback
        );
    },
    getConversation: function(user1_id, user2_id, callback) {
        const query = `
            SELECT m.*, u.username as sender_username
            FROM messages m
            JOIN users u ON m.sender_id = u.id
            WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
        `;
        return db.query(query, [user1_id, user2_id, user2_id, user1_id], callback);
    },
    getConversations: function(userId, callback) {
        const query = `
            SELECT
                u.id,
                u.username,
                u.profile_picture,
                (SELECT message FROM messages
                 WHERE (sender_id = u.id AND receiver_id = ?) OR (sender_id = ? AND receiver_id = u.id)
                 ORDER BY created_at DESC LIMIT 1) as last_message
            FROM users u
            WHERE u.id IN (
                SELECT DISTINCT sender_id FROM messages WHERE receiver_id = ?
                UNION
                SELECT DISTINCT receiver_id FROM messages WHERE sender_id = ?
            )
        `;
        return db.query(query, [userId, userId, userId, userId], callback);
    }
};

module.exports = Message;