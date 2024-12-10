import React, { useEffect, useState } from 'react';
import UploadSection from './UploadSection'; // Import the new UploadSection component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faTrashAlt, faDownload } from '@fortawesome/free-solid-svg-icons';

const MainPage = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch files from the backend
    useEffect(() => {
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
                setError('Failed to fetch files.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

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

            setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));
        } catch (err) {
            console.error(err);
            setError('Error deleting file.');
        }
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <h1 style={styles.title}>FlexFile</h1>
                <p style={styles.subtitle}>Your files, anywhere, anytime.</p>
            </header>

            {/* Drag-and-Drop Upload Section */}
            <UploadSection onUploadSuccess={() => setFiles([])} />

            {/* File List Section */}
            <section style={styles.fileList}>
                <h2 style={styles.fileListTitle}>Your Files</h2>
                {loading && <p>Loading files...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {!loading && !error && files.length === 0 && <p>No files uploaded yet.</p>}
                {!loading &&
                    !error &&
                    files.length > 0 &&
                    files.map((file) => (
                        <div style={styles.fileCard} key={file._id}>
                            <div style={styles.fileInfo}>
                                <FontAwesomeIcon
                                    icon={file.fileType === 'application/pdf' ? faFilePdf : faFilePdf} // Adjust icons based on file type
                                    style={styles.fileIcon}
                                />
                                <div>
                                    <p style={styles.fileName}>{file.fileName}</p>
                                    <p style={styles.fileMeta}>
                                        {`${(file.fileSize / 1024).toFixed(2)} KB • Uploaded ${
                                            new Date(file.uploadDate).toDateString()
                                        }`}
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
    fileActions: {
        display: 'flex',
        gap: '16px',
    },
    actionIcon: {
        fontSize: '20px',
        color: '#64748B',
        cursor: 'pointer',
        transition: 'color 0.2s',
    },
};

export default MainPage;
