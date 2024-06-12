// src/components/AddDocument.js
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PDF } from '../../GraphQl/Mutations';
import { v4 as uuidv4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase';
import { useParams } from 'react-router-dom';

export default function AddDocument() {
    let {lessonId} = useParams();
  const [imageUpload, setImageUpload] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    arabicTitle: '',
    description: '',
    arabicDescription: '',
    lectureNumber: '',
    url: ''
  });

  const [createPdf, { data, loading, error }] = useMutation(CREATE_PDF);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const imageRef = ref(storage, `images/${file.name}-${uuidv4()}`);
    try {
      const snapshot = await uploadBytes(imageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData((prevData) => ({
        ...prevData,
        url: url,
      }));
      setUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.url) {
      alert('Please wait for the file to finish uploading.');
      return;
    }
    try {
        console.log("ffffffffffffffffffff")
      const { data } = await createPdf({
        
        variables: {
         
            lessonID: lessonId,
            title: formData.title,
            arabicTitle: formData.arabicTitle,
            description: formData.description,
            arabicDescription: formData.arabicDescription,
            lectureNumber: parseInt(formData.lectureNumber),
            url: formData.url
          
        }
      });
      console.log("PDF created successfully:", data);
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };
  

  return (
    <div>
      <h2>Create PDF</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Arabic Title</label>
          <input type="text" name="arabicTitle" value={formData.arabicTitle} onChange={handleChange} required />
        </div>
        <div>
          <label>Description</label>
          <input type="text" name="description" value={formData.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Arabic Description</label>
          <input type="text" name="arabicDescription" value={formData.arabicDescription} onChange={handleChange} required />
        </div>
        <div>
          <label>Lecture Number</label>
          <input type="number" name="lectureNumber" value={formData.lectureNumber} onChange={handleChange} required />
        </div>
        <div>
          <input
            className="chooseFileInput"
            type="file"
            onChange={(event) => {
              const file = event.target.files[0];
              setImageUpload(file);
              handleImageUpload(file);
            }}
            required
          />
          {uploading && <p>Uploading file...</p>}
        </div>
        <button type="submit" disabled={loading || uploading}>Create PDF</button>
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && <p>PDF created successfully!</p>}
      </form>
    </div>
  );
}
