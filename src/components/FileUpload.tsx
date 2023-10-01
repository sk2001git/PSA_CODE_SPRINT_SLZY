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
  const [userScores, setUserScores] = useState<UserScore[]>([]);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.name.endsWith('.csv')) {

        const newBlob = new Blob([file], {type: file.type});

        setFileName(file.name);
        setIsUploaded(true);
        setUploadedFile(new File([newBlob], 'NewHireDataSet.csv'));
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
      fetch('http://localhost:5000/your-api-endpoint', {
        method: 'POST',
        body: formData,
      })
        .then(response => {
          if (response.ok) {
            return response.json(); // If your backend returns JSON response
          } else {
            console.log(response.body)
          }
        })
        .then(data => {
          const sortedData = data.sort((a, b) => b.score - a.score);
          setUserScores(sortedData); // data is already an array of UserScore
          
          console.log('Decoded data:', data);
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
        <p><span className={styles.browse}>Browse file</span></p>
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
             You have uploaded the file successfully!
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
      <button className={styles.uploadBtn} onClick={uploadFile}>UPLOAD FILE</button>
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
      )} 
      {isAnalyzed && (
        <div className={styles.resultBox}> 
          <table className={styles.resultTable}>
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {userScores.map((userScore, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{userScore.name}</td>
                  <td>{userScore.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default FileUpload;
