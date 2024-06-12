
import React, { useEffect, useState } from 'react'
import { UPDATE_CHAPTER } from '../../GraphQl/Mutations';
import { LOAD_CHAPTERS ,LOAD_LESSON_DETAILS} from '../../GraphQl/Queries';
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import "../chapters.css";
import Popup from "reactjs-popup";


function LessonUpdate() {
    let { classroomId, chapterId, lessonId } = useParams();
    const navigate = useNavigate()
    const { loading, error, data,refetch } = useQuery(LOAD_LESSON_DETAILS, {
      variables: { chapterID: chapterId },
    });
    useEffect(() => {
        if (data) {
          const lesson = data.lessons.find((item) => item.lessonID === lessonId);
          
        }
      }, [data, lessonId]);
  const [lesson, setLesson] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [lessonData, setLessonData] = useState({
    title: "",
    arabicTitle: "",
    description: "",
    arabicDescription: "",
  });

  const [updateChapter] = useMutation(UPDATE_CHAPTER, {
    onCompleted: () => {
      console.log("Chapter updated successfully.");
      console.log("Navigating to: ", `/classroom/${classroomId}/${chapterId}`);

      navigate(`/dashboard/classrooms/${classroomId}/${chapterId}`);
      refetch()
    },
    onError: (err) => {
      console.error("Error updating chapter:", err);
    },
  });

  useEffect(() => {
    if (data) {
      const foundLesson = data.lessons.find(
        (item) => item.lessonID === lessonId
      );
      setLesson(foundLesson);
      console.log(foundLesson.title);
      if (foundLesson) {
        setLessonData({
          title: foundLesson.title,
          arabicTitle: foundLesson.arabicTitle,
          description: foundLesson.description,
          arabicDescription: foundLesson.arabicDescription,
        });
      }
    }
  }, [data, lessonId]);


  if (loading) return <p>Loading...</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateChapter({
        variables: {
          chapterID: chapterId,
          lessonID:lessonId,
          title: lessonData.title,
          arabicTitle: lessonData.arabicTitle,
          description: lessonData.description,
        },
      });
      setIsEditable(false);
    } catch (err) {
      console.error("Error updating lesson:", err);
    }
  };

  const handleIgnore = () => {
    if (lesson) {
      setLessonData({
        title: lesson.title,
        arabicTitle: lesson.arabicTitle,
        description: lesson.description,
        arabicDescription: lesson.arabicDescription,
      });
    }
    setIsEditable(false);
  };


  return (
    <div >
      <div>
        <h2>درس{lessonData.arabicTitle} </h2>
      </div>
      <div className="chapter-form">
        <form onSubmit={handleSave}>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={lessonData.title}
            disabled={!isEditable}
            onChange={handleInputChange}
          />
          <label>Arabic Title:</label>
          <input
            type="text"
            name="arabicTitle"
            value={lessonData.arabicTitle}
            disabled={!isEditable}
            onChange={handleInputChange}
          />
          <label>Description:</label>
          <textarea
            name="description"
            value={lessonData.description}
            disabled={!isEditable}
            onChange={handleInputChange}
          />
          <label>Arabic Description:</label>
          <textarea
            name="arabicDescription"
            value={lessonData.arabicDescription}
            disabled={!isEditable}
            onChange={handleInputChange}
          />
          {isEditable ? (
            <>
              <button type="submit">Save</button>
              <button type="button" onClick={handleIgnore}>
                Ignore
              </button>
            </>
          ) : (
            <button type="button" onClick={() => setIsEditable(true)}>
              Update
            </button>
          )}
        </form>
      </div>
    </div>
  );

}

export default LessonUpdate