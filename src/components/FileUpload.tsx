'use client';
import React, { useRef, useState } from 'react';
import styles from './FileUpload.module.css';

const FileUpload: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.name.endsWith('.csv')) {
        setFileName(file.name);
        setIsUploaded(true);
      } else {
        alert("Unsupported file format!");
      }
    }
  }

  const removeFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setFileName(null);
    setIsUploaded(false);
  }

  return (
    <div className={styles.uploadContainer}>
      <h2>Upload</h2>
      <div className={styles.uploadBox}>
        <img src="/cloud-icon.svg" alt="Upload Icon" className={styles.uploadIcon} />
        <p>Drag & drop files or <span className={styles.browse}>Browse</span></p>
        <p className={styles.supportedFormat}>Supported format: CSV</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className={styles.fileInput} 
          accept=".csv" 
        />
      </div>
      {isUploaded && (
        <>
          <h3 className={styles.uploadedHeader}> Uploaded </h3>
          <div className={styles.fileDetails}>
            <span>{fileName}</span>
            <img 
            src="/remove-icon.svg" 
            alt="Remove" 
            className={styles.removeIcon} 
            onClick={removeFile}
            />
          </div>
        </>
      )}
      <button className={styles.uploadBtn}>UPLOAD FILES</button>
    </div>
  );
}

export default FileUpload;
