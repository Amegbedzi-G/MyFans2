const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    deleteUser,
    getAllPosts,
    deletePostByAdmin
} = require('../../controllers/admin/admin');
const { protect } = require('../../middleware/auth');
const { admin } = require('../../middleware/admin');

// User management routes
router.get('/users', [protect, admin], getAllUsers);
router.delete('/users/:id', [protect, admin], deleteUser);

// Post management routes
router.get('/posts', [protect, admin], getAllPosts);
router.delete('/posts/:id', [protect, admin], deletePostByAdmin);

module.exports = router;