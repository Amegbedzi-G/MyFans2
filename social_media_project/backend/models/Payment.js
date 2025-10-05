const db = require('../config/db');

const Payment = {
    create: function(data, callback) {
        return db.query(
            'INSERT INTO payments (user_id, post_id, subscription_id, amount, stripe_charge_id, payment_status) VALUES (?, ?, ?, ?, ?, ?)',
            [data.user_id, data.post_id, data.subscription_id, data.amount, data.stripe_charge_id, data.payment_status],
            callback
        );
    },
    findByUserId: function(userId, callback) {
        return db.query('SELECT * FROM payments WHERE user_id = ?', [userId], callback);
    },
    findUserPurchasedPostIds: function(userId, callback) {
        return db.query('SELECT post_id FROM payments WHERE user_id = ? AND post_id IS NOT NULL', [userId], callback);
    }
};

module.exports = Payment;