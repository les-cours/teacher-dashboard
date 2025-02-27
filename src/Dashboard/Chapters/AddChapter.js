import React, { useState, useEffect } from "react";
import { CREATE_CHAPTER } from "../../GraphQl/Mutations";
import { useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { LOAD_CHAPTERS ,LOAD_MY_CLASSROOMS} from "../../GraphQl/Queries"; 
import styles from "./chapters.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddChapter() {
  const notify = (message) => toast.error(message);
  const success = (message) => toast.success(message);
  let { classroomId } = useParams();
  const navigate = useNavigate();
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

  const [createChapter, { loading: mutationLoading, error: mutationError }] =
    useMutation(CREATE_CHAPTER, {
      refetchQueries: [
        {
          query: LOAD_CHAPTERS,
          variables: { classRoomID: classroomId },
        },
        {
          query: LOAD_MY_CLASSROOMS,
        },
      ],
    });

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
      });success("تمت اضافة الوحدة ");
      console.log("Chapter created successfully:", data);
      
      navigate(`/classrooms/${classroomId}/${data.createChapter.chapterID}`);
    } catch (error) {
      notify("خطأ خلال اضافة الوحدة");
      console.error("Error creating chapter:", error);
    }
  };

  return (
    <>
    <div className={styles.AddChapter}>
    
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
   <textarea
    name="description"
    value={formData.description}
    onChange={handleChange}
    placeholder="وصف الوحدة"
    required
  />
  <textarea
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
    </div>

    <ToastContainer />

    </>
  );
}

export default AddChapter;
