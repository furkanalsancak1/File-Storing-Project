import React from 'react';
import UploadSection from './UploadSection'; // Import the new UploadSection component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faTrashAlt, faDownload } from '@fortawesome/free-solid-svg-icons';

const MainPage = () => {
    return (
        <div style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <h1 style={styles.title}>FlexFile</h1>
                <p style={styles.subtitle}>Your files, anywhere, anytime.</p>
            </header>

            {/* Drag-and-Drop Upload Section */}
            <UploadSection />

            {/* File List Section */}
            <section style={styles.fileList}>
                <h2 style={styles.fileListTitle}>Your Files</h2>

                {/* File Card 1 */}
                <div style={styles.fileCard}>
                    <div style={styles.fileInfo}>
                        <FontAwesomeIcon icon={faFilePdf} style={styles.fileIcon} />
                        <div>
                            <p style={styles.fileName}>document.pdf</p>
                            <p style={styles.fileMeta}>2.5 MB • Uploaded 10 months ago</p>
                        </div>
                    </div>
                    <div style={styles.fileActions}>
                        <FontAwesomeIcon icon={faDownload} style={styles.actionIcon} />
                        <FontAwesomeIcon icon={faTrashAlt} style={styles.actionIcon} />
                    </div>
                </div>

                {/* File Card 2 */}
                <div style={styles.fileCard}>
                    <div style={styles.fileInfo}>
                        <FontAwesomeIcon icon={faFilePdf} style={styles.fileIcon} />
                        <div>
                            <p style={styles.fileName}>image.jpg</p>
                            <p style={styles.fileMeta}>1.8 MB • Uploaded 10 months ago</p>
                        </div>
                    </div>
                    <div style={styles.fileActions}>
                        <FontAwesomeIcon icon={faDownload} style={styles.actionIcon} />
                        <FontAwesomeIcon icon={faTrashAlt} style={styles.actionIcon} />
                    </div>
                </div>
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
