const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

// Ensure the uploads directory exists
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log('Uploads directory created.');
} else {
    console.log('Uploads directory exists:', UPLOAD_DIR);
}

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Destination callback triggered'); // Log to debug
        cb(null, UPLOAD_DIR); // Correct upload directory
    },
    filename: (req, file, cb) => {
        console.log('Filename callback triggered'); // Log to debug
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // Accept the file
        } else {
            cb(new Error('Unsupported file type'));
        }
    },
});

// MongoDB Schema for File Metadata
const FileSchema = new mongoose.Schema({
    fileName: String,
    fileType: String,
    fileSize: Number,
    uploadDate: { type: Date, default: Date.now },
});

const File = mongoose.model('File', FileSchema);

// Debugging Middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Routes

// Upload a File
app.post('/upload', upload.single('files'), async (req, res) => {
    try {
        console.log('File received:', req.file); // Log file details

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { originalname, mimetype, size } = req.file;

        // Save file metadata to MongoDB
        const file = new File({
            fileName: originalname,
            fileType: mimetype,
            fileSize: size,
        });
        await file.save();

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            file: {
                id: file._id,
                name: file.fileName,
                type: file.fileType,
                size: file.fileSize,
                uploadDate: file.uploadDate,
            },
        });
    } catch (err) {
        console.error('Error in /upload route:', err.message); // Log error details
        res.status(500).json({ success: false, message: 'Error uploading file', error: err.message });
    }
});

// Get All Files
app.get('/files', async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json(files);
    } catch (err) {
        console.error('Error in /files route:', err.message);
        res.status(500).json({ success: false, message: 'Error fetching files', error: err.message });
    }
});

// Download a File by ID
app.get('/download/:id', async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        const filePath = path.join(UPLOAD_DIR, file.fileName);

        // Check if the file exists before sending it
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'File not found on server' });
        }

        res.download(filePath, file.fileName);
    } catch (err) {
        console.error('Error in /download route:', err.message);
        res.status(500).json({ success: false, message: 'Error downloading file', error: err.message });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
