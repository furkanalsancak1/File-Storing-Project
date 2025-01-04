import bcrypt from 'bcrypt';

const plainPassword = 'erennew123test';
const hashedPassword = '$2b$10$9wDYlJi4Bb6sDG8Pe.jzd.0xvSRiOWvdPXVkTGjFLzE7ZtMTQQX4S';

bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
    if (err) {
        console.error('Error comparing passwords:', err.message);
    } else {
        console.log('Passwords match:', isMatch); // Should log true if matched
    }
});
