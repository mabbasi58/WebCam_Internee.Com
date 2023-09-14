import React from 'react';
import './RecordingButton.css'; 

const RecordingButton = ({ isRecording, startRecording, stopRecording, recordedChunks }) => {
  const handleDownload = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = url;
    a.download = 'recorded-video.webm';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      {!isRecording && (
        <button className='record-button' onClick={startRecording}>Start Recording</button>
      )}
      {isRecording && (
        <button  className="stop-button" onClick={stopRecording}>Stop Recording</button>
      )}
      {recordedChunks  && (
        <button  className=" download-button button-container" onClick={handleDownload}>Download</button>
      )}
      
    </div>
  );
};

export default RecordingButton;


