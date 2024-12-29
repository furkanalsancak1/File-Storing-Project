import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrashAlt, faCheckCircle, faTag } from '@fortawesome/free-solid-svg-icons';

const UploadSection = ({ onUploadSuccess }) => {
    const [isActive, setIsActive] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState([]);
    const [uploadStatus, setUploadStatus] = useState([]);
    const [message, setMessage] = useState('');

    const uploadFileToServer = async (file, index, tags = []) => {
        const formData = new FormData();
        formData.append('files', file);
        if (tags.length > 0) formData.append('tags', tags.join(',')); // Include tags

        try {
            const response = await fetch('http://localhost:5001/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Upload successful:', data);

            // Notify parent component of a successful upload
            if (onUploadSuccess) onUploadSuccess(data.file);

            // Mark upload as completed
            setUploadStatus((prev) => {
                const newStatus = [...prev];
                newStatus[index] = 'uploaded';
                return newStatus;
            });
        } catch (error) {
            console.error('Error uploading file:', error.message);
            setUploadStatus((prev) => {
                const newStatus = [...prev];
                newStatus[index] = 'failed';
                return newStatus;
            });
        }
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);

        if (files.length === 0) {
            setMessage('No files selected.');
            return;
        }

        setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
        setUploadProgress((prev) => [...prev, ...files.map(() => 0)]);
        setUploadStatus((prev) => [...prev, ...files.map(() => 'uploading')]);

        files.forEach((file, idx) => {
            const fileIndex = uploadedFiles.length + idx; // Calculate correct index
            simulateUpload(fileIndex); // Start progress simulation
            uploadFileToServer(file, fileIndex); // Perform real upload
        });
    };

    const simulateUpload = (index) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress((prev) => {
                const newProgress = [...prev];
                newProgress[index] = progress;
                return newProgress;
            });

            if (progress >= 100) {
                clearInterval(interval); // Clear interval when upload completes
            }
        }, 200);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsActive(false);

        const files = Array.from(event.dataTransfer.files);
        handleFileUpload({ target: { files } });
    };

    const handleDelete = (index) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
        setUploadProgress((prev) => prev.filter((_, i) => i !== index));
        setUploadStatus((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddTag = (index, tag) => {
        setUploadedFiles((prevFiles) =>
            prevFiles.map((file, i) =>
                i === index
                    ? {
                          ...file,
                          tags: [...(file.tags || []), tag.trim()],
                      }
                    : file
            )
        );
    };

    return (
        <div>
            <section
                style={{
                    ...styles.uploadArea,
                    borderColor: isActive ? '#3B82F6' : '#CBD5E1',
                }}
                onDragEnter={(e) => {
                    e.preventDefault();
                    setIsActive(true);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDragLeave={() => setIsActive(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <FontAwesomeIcon icon={faUpload} style={styles.uploadIcon} />
                <p style={styles.uploadText}>Drop files here or click to upload</p>
                <p style={styles.uploadSubText}>Upload any file type</p>

                <input
                    id="fileInput"
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />
            </section>

            {message && <p style={styles.message}>{message}</p>}

            <div style={styles.filePreviewContainer}>
                {uploadedFiles.map((file, index) => (
                    <div key={index} style={styles.fileCard}>
                        <div style={styles.fileInfo}>
                            <p style={styles.fileName}>{file.name}</p>
                            <p style={styles.fileMeta}>
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                        </div>

                        {uploadStatus[index] === 'uploaded' ? (
                            <div style={styles.uploadedStatus}>
                                <FontAwesomeIcon icon={faCheckCircle} style={styles.successIcon} />
                                Uploaded
                            </div>
                        ) : uploadStatus[index] === 'failed' ? (
                            <div style={{ color: '#EF4444' }}>Failed</div>
                        ) : (
                            <div style={styles.progressBarContainer}>
                                <div
                                    style={{
                                        ...styles.progressBar,
                                        width: `${uploadProgress[index] || 0}%`,
                                    }}
                                ></div>
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder="Add tag..."
                            style={{ marginTop: '10px', padding: '5px', width: '100%' }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleAddTag(index, e.target.value.trim());
                                    e.target.value = ''; // Clear input
                                }
                            }}
                        />
                        <button
                            style={styles.deleteButton}
                            onClick={() => handleDelete(index)}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            {uploadedFiles.length > 0 && (
                <button style={styles.submitButton}>
                    Submit Files
                </button>
            )}
        </div>
    );
};

const styles = {
    uploadArea: {
        border: '2px dashed #CBD5E1',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        padding: '40px',
        textAlign: 'center',
        marginBottom: '20px',
        width: '100%',
        maxWidth: '600px',
        cursor: 'pointer',
        transition: 'border-color 0.3s ease-in-out',
    },
    uploadIcon: {
        fontSize: '32px',
        color: '#94A3B8',
        marginBottom: '10px',
    },
    uploadText: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#334155',
        marginBottom: '8px',
    },
    uploadSubText: {
        fontSize: '14px',
        color: '#64748B',
    },
    message: {
        color: '#10B981',
        textAlign: 'center',
    },
    filePreviewContainer: {
        marginTop: '20px',
        width: '100%',
        maxWidth: '600px',
    },
    fileCard: {
        display: 'flex',
        flexDirection: 'column',
        padding: '10px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        marginBottom: '10px',
    },
    fileInfo: {
        marginBottom: '10px',
    },
    fileName: {
        fontWeight: '600',
        fontSize: '14px',
        color: '#334155',
    },
    fileMeta: {
        fontSize: '12px',
        color: '#64748B',
    },
    progressBarContainer: {
        backgroundColor: '#E5E7EB',
        borderRadius: '4px',
        height: '8px',
        overflow: 'hidden',
        marginBottom: '10px',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#3B82F6',
        transition: 'width 0.2s ease',
    },
    uploadedStatus: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#10B981',
        fontSize: '14px',
        fontWeight: '600',
    },
    successIcon: {
        color: '#10B981',
    },
    deleteButton: {
        backgroundColor: '#FF4D4F',
        border: 'none',
        borderRadius: '4px',
        color: '#FFFFFF',
        padding: '5px 10px',
        cursor: 'pointer',
        fontSize: '12px',
        alignSelf: 'flex-end',
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#3B82F6',
        color: '#FFFFFF',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontWeight: '600',
        marginTop: '20px',
    },
};

export default UploadSection;
