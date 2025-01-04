import React from 'react';
import NavBar from './nav-bar'; // Import NavBar component

function FileItem({ file }) {
    return (
        <li style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            <p><strong>File Name:</strong> {file.fileName}</p>
            <p><strong>File Type:</strong> {file.fileType}</p>
            <button
                onClick={() => alert(`Downloading ${file.fileName}`)}
                style={{ marginRight: '10px', padding: '5px 10px' }}
            >
                Download
            </button>
            <button
                onClick={() => alert(`Deleting ${file.fileName}`)}
                style={{ padding: '5px 10px' }}
            >
                Delete
            </button>
        </li>
    );
}

function FileBox() {
    const fileData = [
        { fileName: 'document1', fileType: 'pdf' },
        { fileName: 'photo', fileType: 'jpeg' },
        { fileName: 'presentation', fileType: 'pptx' }
    ];

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
            <NavBar /> {/* Add NavBar at the top */}
            <section style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2 style={{ textAlign: 'center' }}>Your Files</h2>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {fileData.map((file, index) => (
                        <FileItem key={index} file={file} />
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default FileBox;