import React, { useState, useEffect } from 'react';
import UploadSection from './UploadSection'; // Import your UploadSection component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faDownload, faFileAlt, faEdit } from '@fortawesome/free-solid-svg-icons';

const EnhancedUpload = () => {
    const [uploadedFiles, setUploadedFiles] = useState([]); // Manage uploaded files
    const [editingTags, setEditingTags] = useState({}); // Track editing state for each file
    const [error, setError] = useState(null); // Track fetch errors

    // Fetch files on component mount
    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('http://localhost:5001/files');
                if (!response.ok) {
                    throw new Error('Failed to fetch files.');
                }
                const files = await response.json();
                setUploadedFiles(files); // Load fetched files into state
            } catch (err) {
                setError(err.message);
            }
        };
        fetchFiles();
    }, []);

    // Handle upload success
    const handleUploadSuccess = (file) => {
        setUploadedFiles((prevFiles) => [...prevFiles, file]); // Add newly uploaded file
    };

    // Handle tag editing
    const handleEditTag = (fileId) => {
        setEditingTags((prev) => ({ ...prev, [fileId]: true }));
    };

    // Handle saving tag
    const handleSaveTag = async (fileId, newTag) => {
        try {
            const response = await fetch(`http://localhost:5001/files/${fileId}/tags`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tag: newTag }),
            });
            if (!response.ok) {
                throw new Error('Failed to update tags.');
            }
            const updatedFile = await response.json();
            setUploadedFiles((prevFiles) =>
                prevFiles.map((file) => (file._id === fileId ? updatedFile : file))
            );
        } catch (error) {
            console.error('Error saving tag:', error);
        }
        setEditingTags((prev) => ({ ...prev, [fileId]: false })); // Exit editing mode
    };

    // Handle delete
    const handleDelete = async (fileId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this file?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5001/delete/${fileId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete file.');
            }
            setUploadedFiles((prevFiles) => prevFiles.filter((file) => file._id !== fileId));
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <header style={styles.header}>
                <h1 style={styles.title}>Upload Your Files</h1>
                <p style={styles.subtitle}>
                    Add tags, preview your files, and organize everything in one place.
                </p>
            </header>

            {/* Main Upload Area */}
            <main style={styles.main}>
                {/* Upload Section */}
                <UploadSection onUploadSuccess={handleUploadSuccess} />

                {/* Display Uploaded Files */}
                <div style={styles.uploadedFilesContainer}>
                    {error && <p style={styles.errorText}>{error}</p>}
                    {uploadedFiles.length > 0 ? (
                        <>
                            <h2 style={styles.filesTitle}>Uploaded Files</h2>
                            {uploadedFiles.map((file) => (
                                <div key={file._id} style={styles.fileCard}>
                                    <div style={styles.fileInfo}>
                                        <FontAwesomeIcon
                                            icon={faFileAlt} // Display a file icon
                                            style={styles.fileIcon}
                                        />
                                        <div>
                                            <p style={styles.fileName}>{file.originalName}</p>
                                            <p style={styles.fileMeta}>
                                                {`${(file.fileSize / 1024).toFixed(2)} KB • Uploaded on ${new Date(
                                                    file.uploadDate
                                                ).toLocaleDateString()}`}
                                            </p>
                                            <p style={styles.fileTags}>
                                                Tags:{' '}
                                                {file.tags.length > 0
                                                    ? file.tags.join(', ')
                                                    : 'No tags'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* File Actions */}
                                    <div style={styles.fileActions}>
                                        <a
                                            href={`http://localhost:5001/download/${file._id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ color: '#3B82F6', marginRight: '10px' }}
                                        >
                                            <FontAwesomeIcon icon={faDownload} />
                                        </a>
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            style={{ color: '#EF4444', cursor: 'pointer' }}
                                            onClick={() => handleDelete(file._id)}
                                        />
                                    </div>

                                    {/* Tag Editing */}
                                    {editingTags[file._id] ? (
                                        <div style={styles.tagInputContainer}>
                                            <input
                                                type="text"
                                                defaultValue={file.tags.join(', ')}
                                                style={styles.tagInput}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleSaveTag(file._id, e.target.value.trim());
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <FontAwesomeIcon
                                            icon={faEdit}
                                            style={{ color: '#3B82F6', cursor: 'pointer', marginLeft: '10px' }}
                                            onClick={() => handleEditTag(file._id)}
                                        />
                                    )}
                                </div>
                            ))}
                        </>
                    ) : (
                        <p style={styles.emptyMessage}>No files uploaded yet.</p>
                    )}
                </div>
            </main>

            {/* Footer Section */}
            <footer style={styles.footer}>
                <p style={styles.footerText}>
                    Powered by <span style={styles.brand}>FlexFile</span> • Organize your digital assets easily.
                </p>
            </footer>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#F1F5F9',
        minHeight: '100vh',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    title: {
        fontSize: '36px',
        fontWeight: 'bold',
        color: '#1F2937',
    },
    subtitle: {
        fontSize: '16px',
        color: '#64748B',
        maxWidth: '600px',
        margin: '10px auto 0',
    },
    main: {
        width: '100%',
        maxWidth: '800px',
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '20px',
    },
    uploadedFilesContainer: {
        marginTop: '20px',
    },
    filesTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: '15px',
    },
    fileCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #E5E7EB',
    },
    fileInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    fileIcon: {
        fontSize: '24px',
        color: '#3B82F6',
    },
    fileName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#1F2937',
    },
    fileMeta: {
        fontSize: '14px',
        color: '#64748B',
    },
    fileTags: {
        fontSize: '14px',
        color: '#1D4ED8',
    },
    fileActions: {
        display: 'flex',
        alignItems: 'center',
    },
    tagInputContainer: {
        marginTop: '10px',
    },
    tagInput: {
        padding: '5px',
        borderRadius: '4px',
        border: '1px solid #E5E7EB',
        width: '100%',
    },
    emptyMessage: {
        fontSize: '16px',
        color: '#64748B',
        textAlign: 'center',
    },
    footer: {
        marginTop: '20px',
        textAlign: 'center',
    },
    footerText: {
        fontSize: '14px',
        color: '#94A3B8',
    },
    brand: {
        fontWeight: 'bold',
        color: '#1F2937',
    },
};

export default EnhancedUpload;
