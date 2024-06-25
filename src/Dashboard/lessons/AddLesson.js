import React, { useEffect, useState } from "react";
import { CREATE_LESSON } from "../../GraphQl/Mutations";
import { useParams } from "react-router-dom";
import { useMutation } from "@apollo/client";
import styles from './lesson.module.css'
function AddLesson() {
  let { classroomId, chapterId } = useParams();

  // State for form data
  const [formData, setFormData] = useState({
    title: "",
    arabicTitle: "",
    description: "",
    arabicDescription: "",
    order : 1,
  });

  useEffect(() => {
    if (!formData) {
      setFormData({
        title: "",
        arabicTitle: "",
        description: "",
        arabicDescription: "",
        order: 1,
      });
    }
  }, [formData]);

  const [createLesson, { loading: mutationLoading, error: mutationError }] =
    useMutation(CREATE_LESSON);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    console.log(formData)    
    try {
      const { data } = await createLesson({
        variables: {
          chapterID: chapterId,
          title: formData.title,
          arabicTitle: formData.arabicTitle,
          description: formData.description,
          order: formData.order,
          //   arabicDescription: formData.arabicDescription,
        },
      });
      console.log("Lesson created successfully:", data);
      // navigate(`/dashboard/classrooms/${classroomId}/${data.createChapter.chapterID}`);
    } catch (error) {
      console.error("Error creating Lesson:", error);
    }
  };

  return (
    <div className={styles.AddLesson}>
      
    <div className={styles.formContainer}>
    <h3>اضافة درس</h3>
      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="اسم الدرس"
          required
        />
        <input
          type="text"
          name="arabicTitle"
          value={formData.arabicTitle}
          onChange={handleChange}
          placeholder="اسم الدرس باللاتينية"
          required
        />
        <textarea
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="وصف الدرس"
          required
        />
        <textarea
          type="text"
          name="arabicDescription"
          value={formData.arabicDescription}
          onChange={handleChange}
          placeholder="وصف الدرس باللاتينية"
          required
        />
        <input type="number" value={FormData.order} onChange={handleChange}/>
        <button type="submit" disabled={mutationLoading}>
          إضافة
        </button>
      </form>
      {mutationLoading && <p>Loading...</p>}
      {mutationError && <p>Error: {mutationError.message}</p>}
    </div>
    </div>
  );
}

export default AddLesson;
