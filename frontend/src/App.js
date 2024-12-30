import React, { useState } from 'react';
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [category, setCategory] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const res = await axios.post('https://magical-wardrobe-assistant.onrender.com', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadedFile(res.data.filename);
      categorizeImage(selectedFile);
    } catch (err) {
      console.error(err);
    }
  };

  const categorizeImage = async (file) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      const model = await mobilenet.load();
      const predictions = await model.classify(img);
      console.log(predictions);
      if (predictions[0].className.includes('shirt')) {
        setCategory('Top');
      } else if (predictions[0].className.includes('pants') || predictions[0].className.includes('jeans')) {
        setCategory('Bottom');
      } else if (predictions[0].className.includes('shoe')) {
        setCategory('Footwear');
      } else {
        setCategory('Accessories');
      }
    };
  };

  return (
    <div className="App">
      <h1>Magical Wardrobe Assistant</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {uploadedFile && (
        <div>
          <h3>Uploaded File:</h3>
          <p>{uploadedFile}</p>
          <p>Category: {category}</p>
        </div>
      )}
    </div>
  );
}

export default App;
// Function to suggest outfits based on category of clothing item uploaded by user 
const suggestOutfit = async (category) => {
  const res = await axios.get(`http://localhost:5000/suggest?category=${category}`);
  console.log(res.data);
};
        