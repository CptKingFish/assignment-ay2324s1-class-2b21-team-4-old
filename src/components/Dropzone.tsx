
import React from 'react';
import { useDropzone } from 'react-dropzone';

export const Previews = () => {
    const [files, setFiles] = React.useState([]);
    const [fileRejections, setFileRejections] = React.useState([]);
    const { getRootProps, getInputProps } = useDropzone({ accept: 'image/*', onDrop: (acceptedFiles, rejectedFiles) => { setFiles(
          acceptedFiles.map(file =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );
        setFileRejections(rejectedFiles);
      },
      maxFiles: 10,
    });
  
    const acceptedFileItems = files.map(file => (
      <li key={file.path}>
        {file.path} - {file.size} bytes
      </li>
    ));
  
    const fileRejectionItems = fileRejections.map(({ file, errors }) => {
      return (
        <li key={file.path}>
          {file.path} - {file.size} bytes
          <ul>
            {errors.map(e => (
              <li key={e.code}>{e.message}</li>
            ))}
          </ul>
        </li>
      );
    });
  
    const thumbs = files.map(file => (
      <div className="inline-flex rounded-md border border-gray-300 mb-8 mr-8 w-100 h-100 p-4" key={file.name}>
        <div className="flex min-w-0 overflow-hidden">
          <img
            src={file.preview}
            className="block w-auto h-100"
            // Revoke data uri after image is loaded
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
        </div>
      </div>
    ));
  
    React.useEffect(() => {
      // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
      return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);
  
    return (
      <section className="container">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside className="flex flex-wrap mt-16">
          {thumbs}
        </aside>
        <aside>
          <h4>Rejected files</h4>
          <ul>{fileRejectionItems}</ul>
        </aside>
      </section>
    );
  }    
  