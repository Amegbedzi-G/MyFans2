const Payment = require('../../models/Payment');
const Post = require('../../models/Post');
const Wallet = require('../../models/Wallet');
const WalletTransaction = require('../../models/WalletTransaction');

// @desc    Get IDs of posts purchased by the user
// @route   GET /api/payments/purchased/posts
// @access  Private
exports.getPurchasedPosts = (req, res, next) => {
    const userId = req.user.id;
    Payment.findUserPurchasedPostIds(userId, (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        const postIds = results.map(r => r.post_id);
        res.status(200).json({ success: true, data: postIds });
    });
};

// @desc    Purchase a premium post
// @route   POST /api/payments/purchase/post/:postId
// @access  Private
exports.purchasePost = (req, res, next) => {
    const userId = req.user.id;
    const postId = req.params.postId;

    // 1. Get post details (to find the price)
    Post.findById(postId, (err, posts) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (posts.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }
        const post = posts[0];
        if (!post.is_premium) {
            return res.status(400).json({ message: 'This post is not for sale.' });
        }

        // 2. Get user's wallet
        Wallet.findByUserId(userId, (err, wallets) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            if (wallets.length === 0) {
                return res.status(400).json({ message: 'User does not have a wallet.' });
            }
            const wallet = wallets[0];

            // 3. Check for sufficient balance
            if (wallet.balance < post.price) {
                return res.status(400).json({ message: 'Insufficient funds.' });
            }

            // 4. Deduct from balance and record transaction
            const newBalance = wallet.balance - post.price;
            Wallet.updateBalance(wallet.id, newBalance, (err, result) => {
                if (err) return res.status(500).json({ message: 'Server error' });

                // 5. Record the wallet transaction
                const transactionData = {
                    wallet_id: wallet.id,
                    type: 'debit',
                    amount: post.price,
                    description: `Purchase of post ID: ${postId}`
                };
                WalletTransaction.create(transactionData, (err, result) => {
                    if (err) return res.status(500).json({ message: 'Server error' });

                    // 6. Record the payment
                    const paymentData = {
                        user_id: userId,
                        post_id: postId,
                        amount: post.price,
                        payment_status: 'completed',
                        stripe_charge_id: 'mock_charge_' + Date.now() // Mock charge ID
                    };
                    Payment.create(paymentData, (err, result) => {
                        if (err) return res.status(500).json({ message: 'Server error' });

                        res.status(200).json({ success: true, message: 'Post purchased successfully.' });
                    });
                });
            });
        });
    });
};