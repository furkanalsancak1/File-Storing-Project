require('dotenv').config();
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });

// File metadata schema
const FileSchema = new mongoose.Schema({
    fileName: String,
    fileType: String,
    fileSize: Number,
    uploadDate: { type: Date, default: Date.now },
});
const File = mongoose.model('File', FileSchema);

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads', { recursive: true });
    console.log('Uploads directory created.');
}

// Upload endpoint (POST)
app.post('/upload', (req, res, next) => {
    console.log('Upload route hit. Headers:', req.headers); // Pre-Multer debug log
    next();
}, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            console.error('No file received. Request body:', req.body);
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('File received:', req.file); // Log file details
        const { originalname, mimetype, size } = req.file;

        // Save file metadata in the database
        const newFile = new File({
            fileName: originalname,
            fileType: mimetype,
            fileSize: size,
        });
        await newFile.save();

        res.status(201).json({ message: 'File uploaded successfully', file: newFile });
    } catch (err) {
        console.error('File upload error:', err);
        res.status(500).json({ message: 'File upload failed', error: err.message });
    }
});

app.post('/debug', (req, res) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); // Collect incoming data
    });

    req.on('end', () => {
        console.log('Raw body received:', body); // Log raw body
        res.status(200).json({ message: 'Raw data received', body });
    });
});

// Get all uploaded files metadata (GET)
app.get('/files', async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json(files);
    } catch (err) {
        console.error('Failed to retrieve files:', err);
        res.status(500).json({ message: 'Failed to retrieve files', error: err });
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
