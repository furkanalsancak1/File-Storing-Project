import bcrypt from 'bcrypt';

const plainPassword = 'eren123test'; // Input password

// Hash and compare inline
bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err.message);
        return;
    }

    console.log('Generated Hash:', hash);

    // Compare the password to its own hash
    bcrypt.compare(plainPassword, hash, (err, isMatch) => {
        if (err) {
            console.error('Error comparing passwords:', err.message);
            return;
        }
        console.log('Passwords match:', isMatch); // Should log true
    });
});
