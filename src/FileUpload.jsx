import React, { useState } from 'react';

function FileUpload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            setMessage('No file selected.');
            return;
        }

        // Check file size (5MB limit)
        if (selectedFile.size > 5 * 1024 * 1024) {
            setMessage('File size exceeds 5MB.');
            return;
        }

        // Validate file type
        const allowedTypes = ['text/plain', 'image/png', 'image/jpeg'];
        if (!allowedTypes.includes(selectedFile.type)) {
            setMessage('File type not allowed. Please upload a text or image file.');
            return;
        }

        setMessage('');
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        setLoading(true); // Start loading
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5001/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('File uploaded successfully!');
            } else {
                setMessage(`Upload failed: ${data.message || 'Unexpected error occurred.'}`);
            }
        } catch (err) {
            console.error(err);
            setMessage('An error occurred during upload.');
        } finally {
            setLoading(false); // End loading
        }
    };

    return (
        <div>
            <h2>Upload a File</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload'}
            </button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default FileUpload;
