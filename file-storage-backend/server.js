const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const authRoutes = require('./routes/auth'); // Auth routes
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });

// Routes
app.use('/auth', authRoutes);

// Ensure uploads directory exists
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
        cb(null, UPLOAD_DIR); // Upload directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique file names
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'));
        }
    },
});

// MongoDB Schema for File Metadata
const FileSchema = new mongoose.Schema({
    fileName: String, // Unique name on server
    originalName: String, // User-friendly display name
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

// File Upload Route
app.post('/upload', upload.single('files'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { filename, originalname, mimetype, size } = req.file;

        const file = new File({
            fileName: filename,
            originalName: originalname,
            fileType: mimetype,
            fileSize: size,
        });

        await file.save();

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            file: {
                id: file._id,
                name: file.originalName,
                type: file.fileType,
                size: file.fileSize,
                uploadDate: file.uploadDate,
            },
        });
    } catch (err) {
        console.error('Error uploading file:', err.message);
        res.status(500).json({ success: false, message: 'Error uploading file', error: err.message });
    }
});

// Get All Files Route
app.get('/files', async (req, res) => {
    try {
        const files = await File.find();
        res.status(200).json(files);
    } catch (err) {
        console.error('Error fetching files:', err.message);
        res.status(500).json({ success: false, message: 'Error fetching files', error: err.message });
    }
});

// Download File by ID Route
app.get('/download/:id', async (req, res) => {
    try {
        const fileId = req.params.id;

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ success: false, message: 'Invalid file ID' });
        }

        // Find the file in the database
        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found in database' });
        }

        // File path on server
        const filePath = path.join(UPLOAD_DIR, file.fileName);

        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: 'File not found on server' });
        }

        res.download(filePath, file.originalName); // Serve the file for download
    } catch (err) {
        console.error('Error downloading file:', err.message);
        res.status(500).json({ success: false, message: 'Error downloading file', error: err.message });
    }
});

// Delete File by ID Route
app.delete('/delete/:id', async (req, res) => {
    try {
        const fileId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ success: false, message: 'Invalid file ID' });
        }

        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found in database' });
        }

        const filePath = path.join(UPLOAD_DIR, file.fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Remove file from server
        }

        await file.deleteOne();
        res.status(200).json({ success: true, message: 'File deleted successfully' });
    } catch (err) {
        console.error('Error deleting file:', err.message);
        res.status(500).json({ success: false, message: 'Error deleting file', error: err.message });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
