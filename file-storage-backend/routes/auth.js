const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Import User model

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'keep45secret';

// Register Route
router.post(
    '/register',
    [
        body('username')
            .trim()
            .notEmpty()
            .withMessage('Username is required'),
        body('email')
            .isEmail()
            .withMessage('Invalid email format')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters')
            .matches(/\d/)
            .withMessage('Password must contain a number'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { username, email, password } = req.body;
        try {
            // Normalize username and email
            const normalizedEmail = email.toLowerCase();

            // Check if email is already registered
            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Save the user
            const user = new User({
                username: username.trim(),
                email: normalizedEmail,
                password: hashedPassword,
            });
            await user.save();

            res.status(201).json({ success: true, message: 'User registered successfully' });
        } catch (err) {
            console.error('Error registering user:', err.message);
            res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
        }
    }
);

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Login request received with email:', email);

        // Normalize email for consistency
        const normalizedEmail = email.toLowerCase();

        // Check if user exists
        const user = await User.findOne({ email: normalizedEmail });
        console.log('User fetched from database:', user);

        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            success: true,
            token,
            user: { username: user.username, email: user.email },
        });
    } catch (err) {
        console.error('Error logging in:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
});

module.exports = router;
