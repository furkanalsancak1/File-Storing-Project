const multer = require('multer');
const path = require('path');
const express = require('express');
const app = express();

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Destination callback triggered'); // Log to debug
        cb(null, path.join(__dirname, 'uploads')); // Use the correct upload directory
    },
    filename: (req, file, cb) => {
        console.log('Filename callback triggered'); // Log to debug
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage });

// Upload Route
app.post('/upload', upload.single('files'), (req, res) => {
    console.log('File received:', req.file); // Log file details
    if (!req.file) {
        return res.status(400).json({ message: 'No file received' });
    }
    res.status(200).json({ message: 'File uploaded', file: req.file });
});

// Start the Server
app.listen(5001, () => {
    console.log('Server running on http://localhost:5001');
});
