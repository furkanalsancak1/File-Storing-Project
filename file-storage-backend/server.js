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
    keyFilename: path.join(__dirname, 'google-cloud-key.json'),
});

const bucketName = process.env.GCS_BUCKET_NAME;
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
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

// MongoDB Schema for File Metadata
const FileSchema = new mongoose.Schema({
    fileName: String,
    originalName: String,
    fileType: String,
    fileSize: Number,
    uploadDate: { type: Date, default: Date.now },
    fileUrl: String,
    tags: [String], // Added field for tags
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
        const { tags } = req.body; // Accept tags from the request body

        const parsedTags = tags ? tags.split(',').map((tag) => tag.trim().toLowerCase()) : [];

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
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;

            const file = new File({
                fileName: cloudFileName,
                originalName: originalname,
                fileType: mimetype,
                fileSize: size,
                fileUrl: publicUrl,
                tags: parsedTags,
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
                    tags: file.tags,
                },
            });
        });

        blobStream.end(req.file.buffer);
    } catch (err) {
        console.error('Error uploading file:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Update Tags for File
app.patch('/files/:id/tags', async (req, res) => {
    try {
        const { id } = req.params;
        const { tag } = req.body;
        const file = await File.findById(id);
        if (!file) return res.status(404).json({ message: 'File not found' });
        if (!file.tags) file.tags = [];
        file.tags.push(tag);
        await file.save();
        res.status(200).json(file);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add tag' });
    }
});

// Delete a tag from a file
app.patch('/files/:id/tags/delete', async (req, res) => {
    try {
        const { id } = req.params;
        const { tag } = req.body;

        const file = await File.findById(id);
        if (!file) return res.status(404).json({ message: 'File not found' });

        file.tags = file.tags.filter((existingTag) => existingTag !== tag);
        await file.save();

        res.status(200).json(file);
    } catch (error) {
        console.error('Error deleting tag:', error.message);
        res.status(500).json({ message: 'Failed to delete tag' });
    }
});

// Edit a tag for a file
app.patch('/files/:id/tags/edit', async (req, res) => {
    try {
        const { id } = req.params;
        const { oldTag, newTag } = req.body;

        const file = await File.findById(id);
        if (!file) return res.status(404).json({ message: 'File not found' });

        const tagIndex = file.tags.indexOf(oldTag);
        if (tagIndex === -1) return res.status(400).json({ message: 'Tag not found' });

        file.tags[tagIndex] = newTag;
        await file.save();

        res.status(200).json(file);
    } catch (error) {
        console.error('Error editing tag:', error.message);
        res.status(500).json({ message: 'Failed to edit tag' });
    }
});


// Get All Files Route (with optional search and tags filter)
app.get('/files', async (req, res) => {
    try {
        const { search, tags } = req.query;

        const query = {};

        if (search) {
            query.originalName = { $regex: search, $options: 'i' };
        }

        if (tags) {
            const tagsArray = tags.split(',').map((tag) => tag.trim().toLowerCase());
            query.tags = { $all: tagsArray };
        }

        const files = await File.find(query);
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

        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return res.status(400).json({ success: false, message: 'Invalid file ID' });
        }

        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ success: false, message: 'File not found' });
        }

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
            return res.status(404).json({ success: false, message: 'File not found' });
        }

        await bucket.file(file.fileName).delete();
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
