import React, { useEffect, useState } from 'react';

function FileList() {
    const [files, setFiles] = useState([]);
    const [tagFilter, setTagFilter] = useState(''); // State for filtering by tags
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch files from the backend
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
                setError('Failed to fetch files.');
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    // Add a tag to a file
    const addTag = async (fileId, tag) => {
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
            ? file.tags.some((tag) => tag.toLowerCase().includes(tagFilter.toLowerCase()))
            : true
    );

    return (
        <div>
            <h2>Uploaded Files</h2>
            {loading && <p>Loading files...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Tag Filter Input */}
            {!loading && (
                <input
                    type="text"
                    placeholder="Filter by tag..."
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    style={{ marginBottom: '20px', padding: '5px' }}
                />
            )}

            {!loading && filteredFiles.length === 0 && <p>No files found with this tag.</p>}

            {/* File List */}
            {!loading &&
                filteredFiles.map((file) => (
                    <div key={file._id} style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '10px', borderRadius: '8px' }}>
                        <h3>{file.originalName}</h3>
                        <p>Type: {file.fileType}</p>
                        <p>Size: {(file.fileSize / 1024).toFixed(2)} KB</p>
                        <p>
                            <strong>Tags:</strong>{' '}
                            {file.tags.length > 0 ? file.tags.join(', ') : 'No tags'}
                        </p>

                        {/* Add Tag Input */}
                        <input
                            type="text"
                            placeholder="Add a tag..."
                            style={{ marginTop: '10px', padding: '5px', width: '200px' }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    addTag(file._id, e.target.value.trim());
                                    e.target.value = ''; // Clear input
                                }
                            }}
                        />
                    </div>
                ))}
        </div>
    );
}

export default FileList;
