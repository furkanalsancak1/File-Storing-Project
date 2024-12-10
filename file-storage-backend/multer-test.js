const express = require('express');
const multer = require('multer');
const app = express();
const upload = multer({ dest: 'uploads/' }); // Simplified Multer setup

app.post('/upload', upload.single('files'), (req, res) => {
    console.log('File:', req.file); // Log the received file
    res.status(200).json({ message: 'File uploaded', file: req.file });
});

app.listen(5001, () => {
    console.log('Server running on http://localhost:5001');
});
