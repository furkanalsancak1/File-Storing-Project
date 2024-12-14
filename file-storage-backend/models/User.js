const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

// Middleware to hash the password before saving the user
UserSchema.pre('save', async function (next) {
    try {
        // Only hash the password if it has been modified or is new
        if (!this.isModified('password')) return next();

        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error('Error hashing password:', error.message);
        next(error);
    }
});

// Instance method to update the user's password
UserSchema.methods.updatePassword = async function (newPassword) {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the new password with the salt
        this.password = await bcrypt.hash(newPassword, salt);

        // Save the updated password
        await this.save();
    } catch (error) {
        console.error('Error updating password:', error.message);
        throw error;
    }
};

// Instance method to validate the password during login
UserSchema.methods.validatePassword = async function (plainPassword) {
    try {
        return await bcrypt.compare(plainPassword, this.password);
    } catch (error) {
        console.error('Error validating password:', error.message);
        throw error;
    }
};

module.exports = mongoose.model('User', UserSchema);
