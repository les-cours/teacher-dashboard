import React, { useState, useEffect } from "react";
import { CREATE_CHAPTER } from "../../GraphQl/Mutations";
import { useMutation } from "@apollo/client";
import {  useParams } from "react-router-dom";
import styles from "./chapters.module.css"
function AddChapter() {
  let { classroomId } = useParams();


  const [formData, setFormData] = useState({
    title: "",
    arabicTitle: "",
    description: "",
    arabicDescription: "",
  });

  useEffect(() => {
    if (!formData) {
      setFormData({
        title: "",
        arabicTitle: "",
        description: "",
        arabicDescription: "",
      });
    }
  }, [formData]);

  const [createChapter, { loading: mutationLoading, error: mutationError }] = useMutation(CREATE_CHAPTER,{});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await createChapter({
        variables: {
          classRoomID: classroomId.toString(),
          title: formData.title,
          arabicTitle: formData.arabicTitle,
          description: formData.description,
          arabicDescription: formData.arabicDescription,
        },
      });
      console.log("Chapter created successfully:", data);
      // navigate(`/dashboard/classrooms/${classroomId}/${data.createChapter.chapterID}`);
    } catch (error) {
      console.error("Error creating chapter:", error);
    }
    
  };

  return (
    <div className={styles.formContainer}>
      <h3>اضافة وحدة</h3>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="اسم الوحدة"
          required
        />
        <input
          type="text"
          name="arabicTitle"
          value={formData.arabicTitle}
          onChange={handleChange}
          placeholder="اسم الوحدة باللاتينية"
          required
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="وصف الوحدة"
          required
        />
        <input
          type="text"
          name="arabicDescription"
          value={formData.arabicDescription}
          onChange={handleChange}
          placeholder="وصف الوحدة باللاتينية"
          required
        />
        <button type="submit" disabled={mutationLoading}>
          إضافة
        </button>
      </form>
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <p>Error: {mutationError.message}</p>}
    </div>
  );
}

export default AddChapter;
