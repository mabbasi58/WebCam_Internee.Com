import React, { useRef, useEffect, useState } from 'react';
import RecordingButton from './RecordingButton';

const CameraView = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('none'); // Initialize with 'none' filter

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1920, height: 1080 } })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleRecordingStop;

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleDataAvailable = (event) => {
    if (event.data.size > 0) {
      setRecordedChunks([...recordedChunks, event.data]);
    }
  };

  const handleRecordingStop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    setRecordedChunks([]);
    const url = URL.createObjectURL(blob);
    setVideoUrl(url); // Set the video URL when recording stops
    setIsRecordingComplete(true);
  };
  const applyFilter = (context, video, width, height) => {
    // Apply the selected filter to the video frame
    context.filter = selectedFilter; // Set the filter style based on the selectedFilter state
    context.drawImage(video, 0, 0, width, height);
  };

  // Function to handle filter selection
  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value); // Update the selectedFilter state when the user selects a filter
  };

  useEffect(() => {
    getVideo();
  }, []);

  const takePhoto = () => {
    const width = 414;
    const height = width / (16 / 9);
    let video = videoRef.current;
    let canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    let context = canvas.getContext('2d');
    applyFilter(context, video, width, height); // Apply the selected filter to the video frame
    setHasPhoto(true);
  };

  const closePreview = () => {
    setHasPhoto(false);
  };

  return (
    <div className="camera">
      <div className="cameraview">
        <video className="video" ref={videoRef}></video>
        <RecordingButton
          isRecording={isRecording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          recordedChunks={recordedChunks}
        />
      
  
        <button className="snap-button" onClick={takePhoto}>
          SNAP!
        </button>

        <select value={selectedFilter} onChange={handleFilterChange}
        style={{
          backgroundColor: '#4F84FF',
          padding: '8px',
          marginLeft:'15rem',
          border: '1px solid #ccc',
          cursor: 'pointer',
          borderRadius: '5px', 
          border: '1px solid #ccc',
          cursor: 'pointer',
          fontSize: '15px', 
          color:'white',
          width: '120px', 
        
          }}>
          <option value="none">No Filter</option>
          <option value="grayscale(100%)">Grayscale</option>

  
        </select>
      </div>
      <div className={'result' + (hasPhoto ? ' hasPhoto' : '')}>
        <canvas ref={canvasRef}></canvas>
        <button className="close-button" onClick={closePreview}>
                    CLOSE
                </button>
      </div>
      {isRecording && <div className="recording-indicator">Recording...</div>}
    </div>
  );
};

export default CameraView;
