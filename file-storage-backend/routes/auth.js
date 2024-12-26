const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Import User model

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'uydEdROVB+Bpx3n/kCKY7Fi7fEJ4zpzZ0IwACyofx0s=';

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
            console.error('Validation errors:', errors.array());
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { username, email, password } = req.body;
        try {
            // Normalize email
            const normalizedEmail = email.toLowerCase();

            // Check if email is already registered
            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser) {
                console.warn('Attempted registration with already used email:', normalizedEmail);
                return res.status(400).json({ success: false, message: 'Email already in use' });
            }

            // Hash the password
            // Inside your register route
            const salt = await bcrypt.genSalt(10);
            console.log('Plain Password:', password); // Log plain password
            const hashedPassword = await bcrypt.hash(password, salt);
            console.log('Hashed Password:', hashedPassword); // Log hashed password


            // Save the user
            const user = new User({
                username: username.trim(),
                email: normalizedEmail,
                password: hashedPassword,
            });
            await user.save();

            console.log('New user registered:', { username: user.username, email: user.email });
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

    // Basic input validation
    if (!email || !password) {
        console.warn('Login attempt failed: missing email or password');
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    console.log('Login attempt with email:', email);

    try {
        // Normalize email for consistent lookup
        const normalizedEmail = email.toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        console.log('User fetched from DB:', user); // Log fetched user details

        if (!user) {
            console.warn('Login attempt failed: user not found');
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Compare provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', isMatch);

        if (!isMatch) {
            console.warn('Login attempt failed: incorrect password');
            return res.status(400).json({ success: false, message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('User logged in successfully:', {
            email: user.email,
            username: user.username,
        });

        // Send success response with token
        res.status(200).json({
            success: true,
            token,
            user: { username: user.username, email: user.email },
        });
    } catch (err) {
        console.error('Error in login route:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


module.exports = router;
