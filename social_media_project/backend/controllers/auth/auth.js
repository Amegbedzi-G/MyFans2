const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = (req, res, next) => {
    const { username, email, password, full_name } = req.body;

    // Basic validation
    if (!username || !email || !password || !full_name) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    User.findByUsername(username, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const newUser = { username, email, password, full_name };
        User.create(newUser, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Server error' });
            }
            res.status(201).json({
                message: 'User registered successfully',
                userId: result.insertId
            });
        });
    });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = (req, res, next) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    User.findByUsername(username, (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = results[0];

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const payload = {
                    id: user.id,
                    is_admin: user.is_admin
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRE
                });

                res.status(200).json({
                    success: true,
                    token
                });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        });
    });
};