import React, { useEffect, useState } from 'react';

function FileList() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('http://localhost:5000/files');
                const data = await response.json();
                setFiles(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchFiles();
    }, []);

    return (
        <div>
            <h2>Uploaded Files</h2>
            <ul>
                {files.map((file) => (
                    <li key={file._id}>
                        <strong>{file.fileName}</strong> - {file.fileType} ({(file.fileSize / 1024).toFixed(2)} KB)
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default FileList;
