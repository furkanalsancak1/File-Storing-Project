const express = require('express');
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

            // Save the user (No hashing applied)
            const user = new User({
                username: username.trim(),
                email: normalizedEmail,
                password, // Save password directly for now
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

        // Direct comparison of plain text passwords (No hashing applied)
        const isMatch = password === user.password;
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

// Profile Route
router.get('/profile', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1]; // Extract the token
        const decoded = jwt.verify(token, JWT_SECRET); // Verify and decode the token

        const user = await User.findById(decoded.id).select('-password'); // Fetch user without password
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user }); // Return user information
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.put('/update-profile', async (req, res) => {
    const { username, email } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret');
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        user.username = username || user.username;
        user.email = email || user.email;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating profile:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/change-password', async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        if (currentPassword !== user.password) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = newPassword; // Update password directly (No hashing for now)
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;
