import React, { useEffect, useState } from 'react';
import UploadSection from './UploadSection';
import EnhancedUpload from './EnhancedUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faTrashAlt, faDownload, faFileImage, faFileAlt, faTag } from '@fortawesome/free-solid-svg-icons';

const MainPage = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tagFilter, setTagFilter] = useState(''); // Tag filter

    // Fetch files from the backend
    const fetchFiles = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5001/files');
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            setFiles(data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch files.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    // Handle File Deletion
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this file?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5001/delete/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete file.');
            }

            setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id)); // Remove file from list
        } catch (err) {
            console.error(err);
            setError('Error deleting file.');
        }
    };

    // Add a tag to a file
    const addTag = async (fileId, tag) => {
        if (!tag.trim()) {
            alert('Tag cannot be empty.');
            return;
        }
        try {
            const response = await fetch(`http://localhost:5001/files/${fileId}/tags`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tag }),
            });

            if (!response.ok) {
                throw new Error('Failed to add tag.');
            }

            const updatedFile = await response.json();
            setFiles((prevFiles) =>
                prevFiles.map((file) => (file._id === fileId ? updatedFile : file))
            );
        } catch (err) {
            console.error(err);
            setError('Error adding tag.');
        }
    };

    // Filter files by tag
    const filteredFiles = files.filter((file) =>
        tagFilter
            ? Array.isArray(file.tags) && file.tags.some((tag) => tag.toLowerCase().includes(tagFilter.toLowerCase()))
            : true
    );


    // Get icon based on file type
    const getFileIcon = (fileType) => {
        if (!fileType) return faFileAlt; // Default icon for unknown file types
        if (fileType.includes('pdf')) return faFilePdf;
        if (fileType.includes('image')) return faFileImage;
        return faFileAlt;
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <h1 style={styles.title}>FlexFile</h1>
                <p style={styles.subtitle}>Your files, anywhere, anytime.</p>
            </header>

            {/* File Upload Section */}
            <EnhancedUpload
                onUploadSuccess={(newFile) => {
                    setFiles((prevFiles) => [...prevFiles, newFile]); // Add newly uploaded file
                }}
            />

            {/* Tag Filter */}
            <input
                type="text"
                placeholder="Filter by tag..."
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                style={{ marginBottom: '20px', padding: '10px', width: '50%' }}
            />

            {/* File List Section */}
            <section style={styles.fileList}>
                <h2 style={styles.fileListTitle}>Your Files</h2>
                {loading && <p>Loading files...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && filteredFiles.length === 0 && <p>No files found.</p>}
                {!loading &&
                    !error &&
                    filteredFiles.map((file) => (
                        <div style={styles.fileCard} key={file._id}>
                            <div style={styles.fileInfo}>
                                <FontAwesomeIcon
                                    icon={getFileIcon(file.fileType)} // Dynamic icon based on file type
                                    style={styles.fileIcon}
                                />
                                <div>
                                    <p style={styles.fileName}>{file.originalName}</p>
                                    <p style={styles.fileMeta}>
                                        {`${(file.fileSize / 1024).toFixed(2)} KB • Uploaded ${
                                            new Date(file.uploadDate).toDateString()
                                        }`}
                                    </p>
                                    <p style={styles.fileTags}>
                                        <FontAwesomeIcon icon={faTag} style={styles.tagIcon} />
                                        {file.tags.length > 0
                                            ? file.tags.join(', ')
                                            : 'No tags'}
                                    </p>
                                </div>
                            </div>
                            <div style={styles.fileActions}>
                                <a
                                    href={`http://localhost:5001/download/${file._id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#3B82F6' }}
                                >
                                    <FontAwesomeIcon icon={faDownload} style={styles.actionIcon} />
                                </a>
                                <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    style={styles.actionIcon}
                                    onClick={() => handleDelete(file._id)}
                                />
                                <input
                                    type="text"
                                    placeholder="Add tag..."
                                    style={{ marginTop: '10px', padding: '5px', width: '100%' }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            addTag(file._id, e.target.value.trim());
                                            e.target.value = ''; // Clear input
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    ))}
            </section>
        </div>
    );
};

const styles = {
    container: {
        fontFamily: 'Inter, sans-serif',
        backgroundColor: '#F8FAFC',
        minHeight: '100vh',
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#0F172A',
    },
    subtitle: {
        fontSize: '16px',
        color: '#64748B',
    },
    fileList: {
        width: '100%',
        maxWidth: '600px',
    },
    fileListTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: '20px',
    },
    fileCard: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
        marginBottom: '16px',
    },
    fileInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    fileIcon: {
        fontSize: '24px',
        color: '#3B82F6',
    },
    fileName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#0F172A',
        margin: 0,
    },
    fileMeta: {
        fontSize: '14px',
        color: '#64748B',
        margin: 0,
    },
    fileTags: {
        fontSize: '14px',
        color: '#1D4ED8',
        margin: 0,
    },
    tagIcon: {
        marginRight: '5px',
    },
    fileActions: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    actionIcon: {
        fontSize: '20px',
        color: '#64748B',
        cursor: 'pointer',
        transition: 'color 0.2s',
    },
};

export default MainPage;
