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

    return (
        <div>
            <h2>Uploaded Files</h2>
            {loading && <p>Loading files...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!loading && !error && (
                <ul>
                    {files.map((file) => (
                        <li key={file._id}>
                            <strong>{file.fileName}</strong> - {file.fileType} ({formatFileSize(file.fileSize)})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default FileList;
