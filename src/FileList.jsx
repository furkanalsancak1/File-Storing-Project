import React, { useEffect, useState } from 'react';

function FileList() {
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFiles = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5001/files');
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                setFiles(data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch files. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    const formatFileSize = (size) => {
        if (size >= 1024 * 1024) {
            return `${(size / (1024 * 1024)).toFixed(2)} MB`;
        } else if (size >= 1024) {
            return `${(size / 1024).toFixed(2)} KB`;
        } else {
            return `${size} bytes`;
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this file?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5001/delete/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            setFiles((prevFiles) => prevFiles.filter((file) => file._id !== id));
        } catch (err) {
            console.error(err);
            setError('Failed to delete file. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Uploaded Files</h2>
            {loading && <p>Loading files...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && files.length === 0 && <p>No files uploaded yet.</p>}
            {!loading && !error && files.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #ddd' }}>
                            <th style={{ textAlign: 'left', padding: '10px' }}>File Name</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Type</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Size</th>
                            <th style={{ textAlign: 'left', padding: '10px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file) => (
                            <tr key={file._id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '10px' }}>{file.fileName}</td>
                                <td style={{ padding: '10px' }}>{file.fileType}</td>
                                <td style={{ padding: '10px' }}>{formatFileSize(file.fileSize)}</td>
                                <td style={{ padding: '10px' }}>
                                    <a
                                        href={`http://localhost:5001/download/${file._id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: '#3B82F6' }}
                                    >
                                        <FontAwesomeIcon icon={faDownload} style={styles.actionIcon} />
                                    </a>
                                    <button
                                        onClick={() => handleDelete(file._id)}
                                        style={{
                                            padding: '5px 10px',
                                            backgroundColor: 'red',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default FileList;
