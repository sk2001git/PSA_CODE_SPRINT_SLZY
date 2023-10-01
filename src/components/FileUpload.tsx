'use client';
import React, { useRef, useState } from 'react';
import styles from './FileUpload.module.css';
import Image from 'next/image';

interface UserScore {
  name: string;
  score: number;
}

const FileUpload: React.FC = () => {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isOnCloud, setIsOnCloud] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAnalyzed, setIsAnalyzed] = useState<boolean>(false);
  const [userScore, setUserScore] = useState<UserScore | null>(null);  // Declare this state outside the function



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.name.endsWith('.csv')) {
        setFileName('NewHireDataSet.csv');
        setIsUploaded(true);
        setUploadedFile(file);
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
    setUploadedFile(null);
  }

  const uploadFile = () => {
    if (isUploaded && uploadedFile) {
      setIsOnCloud(true);
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', uploadedFile);

      // Replace 'your-api-endpoint' with the actual API endpoint URL
      fetch('/your-api-endpoint', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            return response.json(); // If your backend returns JSON response
          } else {
            throw new Error('Failed to upload file');
          }
        })
        .then(data => {
          const scoreData: UserScore = {
            name: data.name,
            score: data.score
          };
          setUserScore(scoreData); // Store the decoded data in the state
          console.log('Decoded data:', scoreData);
        })
        .catch(error => {
          console.error('Error:', error);
        })
        .finally(() => {
          setIsUploaded(false);
          setIsOnCloud(true);
          setIsLoading(false);
          setIsAnalyzed(true);
        })
    } else {
      alert('No file has been uploaded.');
    }
  }

  
  return (
    <div className={styles.uploadContainer}>
      <h2>Upload</h2>
      {!isOnCloud && (
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
      )}
      {isOnCloud && (
        <div className={styles.uploadBox}>
        <img src="/green-tick.svg" alt="Successful Upload" className={styles.uploadIcon} />
          <p>
             You have uploaded the file successfuly!
          </p>
        </div>
      )}
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
      <button className={styles.uploadBtn} onClick={uploadFile}>UPLOAD FILES</button>
      <h2>Results from Test</h2>
      {!isOnCloud && (
      <>
        <div className={styles.uploadBox}>
        <img src="/cross.svg" alt="Cross" className={styles.uploadIcon} />
          <p> Upload the relevant .csv file first</p>
        </div>
      </>
      )}
      {isLoading && (
        <div className={styles.uploadBox}>
          <span className="flex items-center justify-center h-full">
            <span className="animate-spin relative flex h-10 w-10 rounded-sm bg-purple-400 opacity-75"></span>
          </span>
          <p className="mt-4"> Please wait.... We are processing</p>
        </div>
      )
      } 
      {isAnalyzed && userScore && (
      <div className={styles.resultBox}>
        <h3>Analysis Result:</h3>
        <p><strong>Name:</strong> {userScore.name}</p>
        <p><strong>Score:</strong> {userScore.score}</p>
      </div>
    )}
    </div>
  );
}

export default FileUpload;
