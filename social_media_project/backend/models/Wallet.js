const db = require('../config/db');

const Wallet = {
    create: function(userId, callback) {
        return db.query('INSERT INTO wallets (user_id) VALUES (?)', [userId], callback);
    },
    findByUserId: function(userId, callback) {
        return db.query('SELECT * FROM wallets WHERE user_id = ?', [userId], callback);
    },
    updateBalance: function(walletId, newBalance, callback) {
        return db.query('UPDATE wallets SET balance = ? WHERE id = ?', [newBalance, walletId], callback);
    }
};

module.exports = Wallet;