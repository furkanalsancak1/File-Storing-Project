import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrashAlt, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const UploadSection = () => {
    const [isActive, setIsActive] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploadProgress, setUploadProgress] = useState([]); // Track progress for each file
    const [uploadStatus, setUploadStatus] = useState([]); // Track status for each file

    // Simulate upload progress
    const simulateUpload = (index) => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10; // Increment progress
            setUploadProgress((prev) => {
                const newProgress = [...prev];
                newProgress[index] = progress;
                return newProgress;
            });

            if (progress >= 100) {
                clearInterval(interval); // Clear interval when upload completes
                setUploadStatus((prev) => {
                    const newStatus = [...prev];
                    newStatus[index] = 'uploaded'; // Mark file as uploaded
                    return newStatus;
                });
            }
        }, 200); // Update every 200ms
    };

    // Handle File Upload (Add to state and start upload simulation)
    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files); // Get selected files
        setUploadedFiles((prevFiles) => [...prevFiles, ...files]); // Add files to state
        setUploadProgress((prev) => [...prev, ...files.map(() => 0)]); // Initialize progress for each file
        setUploadStatus((prev) => [...prev, ...files.map(() => 'uploading')]); // Set status to "uploading"

        files.forEach((_, index) => {
            simulateUpload(uploadedFiles.length + index); // Simulate upload for each file
        });
    };

    // Handle File Drop
    const handleDrop = (event) => {
        event.preventDefault();
        setIsActive(false);

        const files = Array.from(event.dataTransfer.files); // Get dropped files
        setUploadedFiles((prevFiles) => [...prevFiles, ...files]); // Add files to state
        setUploadProgress((prev) => [...prev, ...files.map(() => 0)]); // Initialize progress for each file
        setUploadStatus((prev) => [...prev, ...files.map(() => 'uploading')]); // Set status to "uploading"

        files.forEach((_, index) => {
            simulateUpload(uploadedFiles.length + index); // Simulate upload for each file
        });
    };

    // Delete File
    const handleDelete = (index) => {
        const updatedFiles = uploadedFiles.filter((_, i) => i !== index); // Remove file by index
        const updatedProgress = uploadProgress.filter((_, i) => i !== index); // Remove progress for the file
        const updatedStatus = uploadStatus.filter((_, i) => i !== index); // Remove status for the file
        setUploadedFiles(updatedFiles);
        setUploadProgress(updatedProgress);
        setUploadStatus(updatedStatus);
    };

    return (
        <div>
            {/* Upload Section */}
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

                {/* Hidden file input */}
                <input
                    id="fileInput"
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />
            </section>

            {/* Uploaded Files Preview with Progress */}
            <div style={styles.filePreviewContainer}>
                {uploadedFiles.map((file, index) => (
                    <div key={index} style={styles.fileCard}>
                        <div style={styles.fileInfo}>
                            <p style={styles.fileName}>{file.name}</p>
                            <p style={styles.fileMeta}>
                                {(file.size / 1024).toFixed(2)} KB
                            </p>
                        </div>

                        {/* Progress Bar or Uploaded Status */}
                        {uploadStatus[index] === 'uploaded' ? (
                            <div style={styles.uploadedStatus}>
                                <FontAwesomeIcon icon={faCheckCircle} style={styles.successIcon} />
                                Uploaded
                            </div>
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

                        <button
                            style={styles.deleteButton}
                            onClick={() => handleDelete(index)}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                ))}
            </div>
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
};

export default UploadSection;
