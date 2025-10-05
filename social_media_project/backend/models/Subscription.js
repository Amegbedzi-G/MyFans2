const db = require('../config/db');

const Subscription = {
    create: function(data, callback) {
        return db.query(
            'INSERT INTO subscriptions (subscriber_id, creator_id, end_date, is_active) VALUES (?, ?, ?, ?)',
            [data.subscriber_id, data.creator_id, data.end_date, data.is_active],
            callback
        );
    },
    findBySubscriberAndCreator: function(subscriberId, creatorId, callback) {
        return db.query(
            'SELECT * FROM subscriptions WHERE subscriber_id = ? AND creator_id = ?',
            [subscriberId, creatorId],
            callback
        );
    },
    update: function(id, data, callback) {
        return db.query(
            'UPDATE subscriptions SET end_date = ?, is_active = ? WHERE id = ?',
            [data.end_date, data.is_active, id],
            callback
        );
    }
};

module.exports = Subscription;