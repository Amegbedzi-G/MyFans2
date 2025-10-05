const db = require('../config/db');

const WalletTransaction = {
    create: function(data, callback) {
        return db.query(
            'INSERT INTO wallet_transactions (wallet_id, type, amount, description) VALUES (?, ?, ?, ?)',
            [data.wallet_id, data.type, data.amount, data.description],
            callback
        );
    },
    findByWalletId: function(walletId, callback) {
        return db.query('SELECT * FROM wallet_transactions WHERE wallet_id = ? ORDER BY created_at DESC', [walletId], callback);
    }
};

module.exports = WalletTransaction;