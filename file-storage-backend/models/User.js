const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        maxlength: 100,
    },
    password: {
        type: String,
        required: true,
    },
});

// Temporary bypass for password hashing
// Middleware to hash the password before saving the user (DISABLED)
UserSchema.pre('save', async function (next) {
    try {
        // Do not hash the password for now
        next();
    } catch (error) {
        console.error('Error in save middleware:', error.message);
        next(error);
    }
});

// Instance method to update the user's password (DISABLED HASHING)
UserSchema.methods.updatePassword = async function (newPassword) {
    try {
        // Save the new password directly (no hashing)
        this.password = newPassword;
        await this.save();
    } catch (error) {
        console.error('Error updating password:', error.message);
        throw error;
    }
};

// Instance method to validate the password during login (PLAIN TEXT VALIDATION)
UserSchema.methods.validatePassword = async function (plainPassword) {
    try {
        // Compare plain text passwords directly
        return plainPassword === this.password;
    } catch (error) {
        console.error('Error validating password:', error.message);
        throw error;
    }
};

module.exports = mongoose.model('User', UserSchema);
