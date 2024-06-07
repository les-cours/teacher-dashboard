import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, gql } from '@apollo/client';
import jsonData from "./data.json";
import "./chapters.css";
import { CREATE_CHAPTER } from "../GraphQl/Mutations";
import { LOAD_CHAPTERS } from "../GraphQl/Queries";

function Chapters() {
  let { classroomId } = useParams();
  const { loading, error, data } = useQuery(LOAD_CHAPTERS, {
    variables: { classRoomID: classroomId },
  });

  // State for form visibility
  const [isFormVisible, setFormVisible] = useState(false);

  // State for form data
  const [formData, setFormData] = useState({
    title: "",
    arabicTitle: "",
    description: "",
    arabicDescription: ""
  });

  // UseMutation hook to call the CREATE_CHAPTER mutation
  const [createChapter, { data: mutationData, loading: mutationLoading, error: mutationError }] = useMutation(CREATE_CHAPTER);

  const addChapter = () => {
    setFormVisible(true);
  };

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
          arabicDescription: formData.arabicDescription
        }
      });
      console.log('Chapter created successfully:', data);
    } catch (error) {
      console.error('Error creating chapter:', error);
    }
    setFormVisible(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  const chapters = data ? data.chapters : [];

  return (
    <div className="chapters" style={{ marginRight: "200px" }}>
      <div>
        <h2>وحدات الصف {classroomId}</h2>
      </div>

      {isFormVisible ? (
        <div className="form-container">
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
            <button type="submit" disabled={mutationLoading}>إضافة</button>
            <button type="button" onClick={() => setFormVisible(false)}>إلغاء</button>
          </form>
          {mutationLoading && <p>Loading...</p>}
          {mutationError && <p>Error: {mutationError.message}</p>}
        </div>
      ) : (
        <div>
          <ul className="list">
            {chapters &&
              chapters.map((chapter, index) => (
                
                <Link
                  to={`/dashboard/classrooms/${classroomId}/${chapter.chapterID}`}
                  className="smallcontainer"
                  key={index}
                >{`وحدة ${chapter.arabicTitle}`}</Link>
              ))}
            <button
              className="smallcontainer"
              style={{ backgroundColor: "#4CAF50" }}
              onClick={addChapter}
            >
              اضافة وحدة +
            </button>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Chapters;

