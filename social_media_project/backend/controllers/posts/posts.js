const Post = require('../../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = (req, res, next) => {
    Post.findAll((err, posts) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        res.status(200).json({
            success: true,
            count: posts.length,
            data: posts
        });
    });
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = (req, res, next) => {
    const { caption, is_premium, price } = req.body;
    const postId = req.params.id;

    Post.findById(postId, (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const post = results[0];
        if (post.user_id !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedData = {
            caption: caption || post.caption,
            is_premium: is_premium !== undefined ? is_premium : post.is_premium,
            price: price !== undefined ? price : post.price
        };

        Post.update(postId, updatedData, (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.status(200).json({ success: true, message: 'Post updated' });
        });
    });
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = (req, res, next) => {
    const postId = req.params.id;

    Post.findById(postId, (err, results) => {
        if (err) return res.status(500).json({ message: 'Server error' });
        if (results.length === 0) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const post = results[0];
        if (post.user_id !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        Post.delete(postId, (err, result) => {
            if (err) return res.status(500).json({ message: 'Server error' });
            res.status(200).json({ success: true, message: 'Post deleted' });
        });
    });
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
exports.createPost = (req, res, next) => {
    const { caption, media_url, media_type, is_premium, price } = req.body;
    const user_id = req.user.id;

    if (!media_url || !media_type) {
        return res.status(400).json({ message: 'Please provide media URL and type' });
    }

    const newPost = {
        user_id,
        caption,
        media_url,
        media_type,
        is_premium: is_premium || false,
        price: price || 0
    };

    Post.create(newPost, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Server error' });
        }
        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            postId: result.insertId
        });
    });
};