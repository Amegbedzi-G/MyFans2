const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    create: function(data, callback) {
        bcrypt.hash(data.password, 10, function(err, hash) {
            if (err) throw err;
            return db.query(
                'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
                [data.username, data.email, hash, data.full_name],
                callback
            );
        });
    },
    findByUsername: function(username, callback) {
        return db.query('SELECT * FROM users WHERE username = ?', [username], callback);
    },
    findById: function(id, callback) {
        return db.query('SELECT * FROM users WHERE id = ?', [id], callback);
    },
    findAll: function(callback) {
        return db.query('SELECT id, username, email, full_name, created_at FROM users', callback);
    },
    delete: function(id, callback) {
        return db.query('DELETE FROM users WHERE id = ?', [id], callback);
    }
};

module.exports = User;