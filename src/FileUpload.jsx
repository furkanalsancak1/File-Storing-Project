import React, { useState } from 'react';
import axios from 'axios';

function FileUpload() {
    const [files, setFiles] = useState([]); // Files to be uploaded
    const [uploadedFiles, setUploadedFiles] = useState([]); // Successfully uploaded files
    const [submittedFiles, setSubmittedFiles] = useState([]); // Files moved to "Your Files"
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle file input
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
        console.log('Selected files:', selectedFiles);
    };

    // Upload files to the server
    const handleUpload = async () => {
        const uploaded = [];
        for (let file of files) {
            const formData = new FormData();
            formData.append('files', file);

            try {
                const response = await axios.post('http://localhost:5001/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                uploaded.push({ id: response.data.id, name: file.name, url: response.data.url });
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Failed to upload file');
            }
        }

        setUploadedFiles((prev) => [...prev, ...uploaded]);
        setFiles([]);
        console.log('Uploaded files:', uploaded);
        console.log('State of uploadedFiles:', uploadedFiles);
    };

    // Handle submission of uploaded files
    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            await axios.post('http://localhost:5001/submit', { files: uploadedFiles });

            setSubmittedFiles((prev) => [...prev, ...uploadedFiles]);
            setUploadedFiles([]); // Clear the uploaded files

            alert('Files successfully submitted!');
        } catch (error) {
            console.error('Error submitting files:', error);
            alert('Failed to submit files. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
            <h1>FlexFile</h1>
            <p>Your files, anywhere, anytime.</p>

            {/* File Upload Section */}
            <div style={{ border: '1px dashed #ccc', padding: '20px', borderRadius: '10px' }}>
                <input type="file" multiple onChange={handleFileChange} />
                <button
                    onClick={handleUpload}
                    disabled={!files.length}
                    style={{ marginTop: '10px' }}
                >
                    Upload Files
                </button>
            </div>

            {/* Uploaded Files Section */}
            {uploadedFiles.length > 0 && (
                <div style={{ marginTop: '20px', position: 'relative' }}>
                    <h3>Uploaded Files</h3>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {uploadedFiles.map((file) => (
                            <li
                                key={file.id}
                                style={{
                                    border: '1px solid #ddd',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    margin: '10px 0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ textDecoration: 'none', color: '#007BFF' }}
                                >
                                    {file.name}
                                </a>
                                <span style={{ color: 'green', fontWeight: 'bold' }}>✓ Uploaded</span>
                            </li>
                        ))}
                    </ul>

                    {/* Submit Files Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#007BFF',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Files'}
                    </button>
                </div>
            )}

            {/* Submitted Files Section */}
            {submittedFiles.length > 0 && (
                <div style={{ marginTop: '30px' }}>
                    <h3>Your Files</h3>
                    <ul>
                        {submittedFiles.map((file) => (
                            <li key={file.id}>
                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                    {file.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default FileUpload;