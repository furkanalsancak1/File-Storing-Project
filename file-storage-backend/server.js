const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const authRoutes = require('./routes/auth'); // Auth routes

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize Google Cloud Storage
const storage = new Storage({
    keyFilename: path.join(__dirname, 'google-cloud-key.json'), // Ensure this file exists in your directory
});

const bucketName = process.env.GCS_BUCKET_NAME; // Set your bucket name in the .env file
const bucket = storage.bucket(bucketName);

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

// Multer Configuration
const upload = multer({
    storage: multer.memoryStorage(), // Store file in memory for Google Cloud upload
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: (req, file, cb) => {
        // Allow all file types
        cb(null, true);
    },
});


// MongoDB Schema for File Metadata
const FileSchema = new mongoose.Schema({
    fileName: String, // File name in the bucket
    originalName: String, // Original file name
    fileType: String,
    fileSize: Number,
    uploadDate: { type: Date, default: Date.now },
    fileUrl: String, // URL for accessing the file
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

        const { originalname, mimetype, size } = req.file;

        // Create a unique filename for the cloud
        const cloudFileName = `${Date.now()}-${originalname}`;
        const blob = bucket.file(cloudFileName);

        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: mimetype,
        });

        blobStream.on('error', (err) => {
            console.error('Error uploading to Google Cloud:', err.message);
            res.status(500).json({ success: false, message: 'Error uploading file', error: err.message });
        });

        blobStream.on('finish', async () => {
            // File upload complete
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

            // Save file metadata to MongoDB
            const file = new File({
                fileName: cloudFileName,
                originalName: originalname,
                fileType: mimetype,
                fileSize: size,
                fileUrl: publicUrl,
            });

            await file.save();

            res.status(200).json({
                success: true,
                message: 'File uploaded successfully to Google Cloud',
                file: {
                    id: file._id,
                    name: file.originalName,
                    type: file.fileType,
                    size: file.fileSize,
                    uploadDate: file.uploadDate,
                    url: file.fileUrl,
                },
            });
        });

        blobStream.end(req.file.buffer);
    } catch (err) {
        console.error('Error uploading file:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
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

        // Redirect user to the file's public URL
        res.redirect(file.fileUrl);
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

        // Delete file from Google Cloud Storage
        await bucket.file(file.fileName).delete();

        // Remove file metadata from the database
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
