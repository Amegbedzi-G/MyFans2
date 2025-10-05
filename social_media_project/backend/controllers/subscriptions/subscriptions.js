const Subscription = require('../../models/Subscription');
const Wallet = require('../../models/Wallet');
const WalletTransaction = require('../../models/WalletTransaction');
const Payment = require('../../models/Payment');

const SUBSCRIPTION_PRICE = 5.00; // Fixed subscription price of $5.00

// @desc    Subscribe to a creator
// @route   POST /api/subscriptions/subscribe/:creatorId
// @access  Private
exports.subscribeToCreator = (req, res, next) => {
    const subscriberId = req.user.id;
    const creatorId = req.params.creatorId;

    if (subscriberId == creatorId) {
        return res.status(400).json({ message: 'You cannot subscribe to yourself.' });
    }

    // 1. Check if already subscribed and active
    Subscription.findBySubscriberAndCreator(subscriberId, creatorId, (err, subscriptions) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (subscriptions.some(s => s.is_active)) {
            return res.status(400).json({ message: 'Already subscribed to this creator.' });
        }

        // 2. Get user's wallet
        Wallet.findByUserId(subscriberId, (err, wallets) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            if (wallets.length === 0) {
                return res.status(400).json({ message: 'User does not have a wallet.' });
            }
            const wallet = wallets[0];

            // 3. Check for sufficient balance
            if (wallet.balance < SUBSCRIPTION_PRICE) {
                return res.status(400).json({ message: 'Insufficient funds for subscription.' });
            }

            // 4. Deduct from balance
            const newBalance = wallet.balance - SUBSCRIPTION_PRICE;
            Wallet.updateBalance(wallet.id, newBalance, (err, result) => {
                if (err) return res.status(500).json({ message: 'Server error' });

                // 5. Create subscription record (valid for 30 days)
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + 30);
                const newSubscription = {
                    subscriber_id: subscriberId,
                    creator_id: creatorId,
                    end_date: endDate,
                    is_active: true
                };
                Subscription.create(newSubscription, (err, subResult) => {
                    if (err) return res.status(500).json({ message: 'Server error' });

                    // 6. Record wallet transaction and payment
                    const transactionData = {
                        wallet_id: wallet.id,
                        type: 'debit',
                        amount: SUBSCRIPTION_PRICE,
                        description: `Subscription to creator ID: ${creatorId}`
                    };
                    WalletTransaction.create(transactionData, (err, transResult) => {
                        if (err) return res.status(500).json({ message: 'Server error' });

                        const paymentData = {
                            user_id: subscriberId,
                            subscription_id: subResult.insertId,
                            amount: SUBSCRIPTION_PRICE,
                            payment_status: 'completed',
                            stripe_charge_id: 'mock_sub_' + Date.now()
                        };
                        Payment.create(paymentData, (err, paymentResult) => {
                            if (err) return res.status(500).json({ message: 'Server error' });
                            res.status(200).json({ success: true, message: 'Subscribed successfully.' });
                        });
                    });
                });
            });
        });
    });
};