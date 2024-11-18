function FileBox (){
    const fileData = [
        { fileName: 'document1', fileType: 'pdf' },
        { fileName: 'photo', fileType: 'jpeg' },
        { fileName: 'presentation', fileType: 'pptx' }
      ];
return <section>
    <ul>
        {fileData.map((file, index) => (
          <li key={index}>
            <p><strong>File Name:</strong> {file.fileName}</p>
            <p><strong>File Type:</strong> {file.fileType}</p>
          </li>
        ))}
      </ul>
</section>

}

export default FileBox