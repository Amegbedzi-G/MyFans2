const db = require('../config/db');

const Post = {
    create: function(data, callback) {
        return db.query(
            'INSERT INTO posts (user_id, caption, media_url, media_type, is_premium, price) VALUES (?, ?, ?, ?, ?, ?)',
            [data.user_id, data.caption, data.media_url, data.media_type, data.is_premium, data.price],
            callback
        );
    },
    findAll: function(callback) {
        // Join with users table and get like/comment counts
        const query = `
            SELECT
                p.*,
                u.username,
                u.profile_picture,
                (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
                (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
            FROM posts p
            JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC
        `;
        return db.query(query, callback);
    },
    findById: function(id, callback) {
        return db.query('SELECT * FROM posts WHERE id = ?', [id], callback);
    },
    update: function(id, data, callback) {
        return db.query(
            'UPDATE posts SET caption = ?, is_premium = ?, price = ? WHERE id = ?',
            [data.caption, data.is_premium, data.price, id],
            callback
        );
    },
    delete: function(id, callback) {
        return db.query('DELETE FROM posts WHERE id = ?', [id], callback);
    }
};

module.exports = Post;