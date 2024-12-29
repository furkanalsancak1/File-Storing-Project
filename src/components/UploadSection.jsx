import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTrashAlt, faCheckCircle, faTag, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const UploadSection = ({ onUploadSuccess }) => {
    const [heldFiles, setHeldFiles] = useState([]); // Temporarily hold files
    const [message, setMessage] = useState('');

    // Handle file input
    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);

        if (files.length === 0) {
            setMessage('No files selected.');
            return;
        }

        const newFiles = files.map((file) => ({
            file, // Original file object
            tags: [], // Default empty tags
            id: Date.now() + Math.random(), // Temporary unique ID
        }));

        setHeldFiles((prevFiles) => [...prevFiles, ...newFiles]); // Add files to temporary holding
    };

    // Add a tag to a file
    const handleAddTag = (fileId, tag) => {
        if (!tag.trim()) {
            setMessage('Tag cannot be empty.');
            return;
        }

        setHeldFiles((prevFiles) =>
            prevFiles.map((item) =>
                item.id === fileId
                    ? { ...item, tags: [...item.tags, tag.trim()] }
                    : item
            )
        );
    };

    // Remove a tag from a file
    const handleRemoveTag = (fileId, tagToRemove) => {
        setHeldFiles((prevFiles) =>
            prevFiles.map((item) =>
                item.id === fileId
                    ? { ...item, tags: item.tags.filter((tag) => tag !== tagToRemove) }
                    : item
            )
        );
    };

    // Delete a file from heldFiles
    const handleDelete = (fileId) => {
        setHeldFiles((prevFiles) => prevFiles.filter((item) => item.id !== fileId));
    };

    // Submit files to the server
    const handleSubmit = async () => {
        if (heldFiles.length === 0) {
            setMessage('No files to submit.');
            return;
        }

        try {
            for (const heldFile of heldFiles) {
                const formData = new FormData();
                formData.append('files', heldFile.file);
                formData.append('tags', heldFile.tags.join(','));

                const response = await fetch('http://localhost:5001/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to upload file.');
                }

                const data = await response.json();
                if (onUploadSuccess) onUploadSuccess(data.file); // Notify parent about success
            }

            setMessage('Files uploaded successfully!');
            setHeldFiles([]); // Clear held files after submission
        } catch (error) {
            console.error('Error uploading files:', error.message);
            setMessage('Failed to upload files.');
        }
    };

    return (
        <div>
            {/* Upload Area */}
            <section
                style={{
                    border: '2px dashed #CBD5E1',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    padding: '40px',
                    textAlign: 'center',
                    marginBottom: '20px',
                    cursor: 'pointer',
                }}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <FontAwesomeIcon icon={faUpload} style={{ fontSize: '32px', color: '#94A3B8' }} />
                <p>Drop files here or click to upload</p>
                <input
                    id="fileInput"
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />
            </section>

            {message && <p style={{ color: '#10B981', textAlign: 'center' }}>{message}</p>}

            {/* File Preview */}
            <div style={{ marginTop: '20px' }}>
                {heldFiles.map((item) => (
                    <div
                        key={item.id}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '10px',
                            marginBottom: '10px',
                            border: '1px solid #CBD5E1',
                            borderRadius: '8px',
                        }}
                    >
                        <div style={{ marginBottom: '10px' }}>
                            <p>{item.file.name}</p>
                            <p style={{ color: '#64748B' }}>{(item.file.size / 1024).toFixed(2)} KB</p>
                            <p style={{ color: '#1D4ED8' }}>
                                Tags: {item.tags.length > 0 ? item.tags.join(', ') : 'No tags'}
                            </p>
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Add tag..."
                                style={{ padding: '5px', marginBottom: '10px', width: '100%' }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddTag(item.id, e.target.value.trim());
                                        e.target.value = ''; // Clear input
                                    }
                                }}
                            />
                            {item.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    style={{
                                        display: 'inline-block',
                                        backgroundColor: '#E5E7EB',
                                        color: '#1F2937',
                                        borderRadius: '8px',
                                        padding: '5px 10px',
                                        marginRight: '10px',
                                        marginBottom: '5px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleRemoveTag(item.id, tag)}
                                >
                                    {tag}{' '}
                                    <FontAwesomeIcon icon={faTimesCircle} style={{ marginLeft: '5px' }} />
                                </span>
                            ))}
                        </div>
                        <button
                            style={{
                                backgroundColor: '#FF4D4F',
                                color: '#FFFFFF',
                                borderRadius: '5px',
                                padding: '5px 10px',
                                cursor: 'pointer',
                            }}
                            onClick={() => handleDelete(item.id)}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Submit Button */}
            {heldFiles.length > 0 && (
                <button
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#3B82F6',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        marginTop: '20px',
                    }}
                    onClick={handleSubmit}
                >
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
