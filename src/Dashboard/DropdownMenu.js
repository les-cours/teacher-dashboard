import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import styles from "./DropdownMenu.module.css";
import { LOAD_MY_CLASSROOMS } from "../GraphQl/Queries";

const DropdownMenu = () => {
  let { classroomId, chapterId } = useParams();

  const { loading, error, data, refetch } = useQuery(LOAD_MY_CLASSROOMS);

  const [chapterVisibility, setChapterVisibility] = useState([]);
  const [lessonVisibility, setLessonVisibility] = useState([]);

  useEffect(() => {
    if (data && data.MyClassRoomsTeacher) {
      const initialVisibilityState = data.MyClassRoomsTeacher.map(() => false);
      setChapterVisibility(initialVisibilityState);
      setLessonVisibility(initialVisibilityState);
    }
    refetch();
  }, [data, refetch]);

  const toggleLessonVisibility = (chapterIndex) => {
    const updatedVisibility = [...lessonVisibility];
    updatedVisibility[chapterIndex] = !updatedVisibility[chapterIndex];
    setLessonVisibility(updatedVisibility);
  };

  const toggleChapterVisibility = (classroomIndex) => {
    const updatedVisibility = [...chapterVisibility];
    updatedVisibility[classroomIndex] = !updatedVisibility[classroomIndex];
    setChapterVisibility(updatedVisibility);
  };

  const handleAddChapter = (classroomId) => {
    console.log(`Add chapter to classroom ${classroomId}`);
  };

  const handleAddLesson = (chapterId) => {
    console.log(`Add lesson to chapter ${chapterId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className={styles.dropdownMenu}>
      {data &&
        data.MyClassRoomsTeacher &&
        data.MyClassRoomsTeacher.map((item, classroomIndex) => (
          <div key={classroomIndex} className={styles.classroom}>
            <Link
              to={`/classrooms/${item.classRoomID}`}
              className={styles.classroomBtn}
              onClick={() => toggleChapterVisibility(classroomIndex)}
            >
              {`قسم ${item.arabicTitle}`}
            </Link>
            {chapterVisibility[classroomIndex] && (
              <div className={styles.dropdownContent}>
                <Link
                  to={`classrooms/${classroomId}/addChapter`}
                  className={styles.addChapter}
                  onClick={() => handleAddChapter(item.classRoomID)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#5f6368"
                  >
                    <path d="M520-400h80v-120h120v-80H600v-120h-80v120H400v80h120v120ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
                  </svg>
                  إضافة وحدة
                </Link>
                {item.chapters &&
                  item.chapters.map((chapter, chapterIndex) => (
                    <div key={chapterIndex} className={styles.chapters}>
                      <Link
                        className={styles.chapterLink}
                        to={`/classrooms/${item.classRoomID}/${chapter.chapterID}`}
                        onClick={() => {
                          toggleLessonVisibility(chapterIndex);
                          refetch();
                        }}
                      >
                        {`وحدة ${chapter.arabicTitle}`}
                      </Link>
                      {lessonVisibility[chapterIndex] && (
                        <div className={styles.lessons}>
                          <div>
                            <Link
                              to={{
                                pathname: `classrooms/${classroomId}/${chapterId}/addLesson`,
                              }}
                              onClick={() => handleAddLesson(chapter.chapterID)}
                              className={styles.addLesson}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#5f6368"
                              >
                                <path d="M440-240h80v-120h120v-80H520v-120h-80v120H320v80h120v120ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                              </svg>
                              إضافة درس
                            </Link>
                          </div>
                          {chapter.lessons.map((lesson, lessonIndex) => (
                            <Link
                              className={styles.lessonLink}
                              to={`/classrooms/${item.classRoomID}/${chapter.chapterID}/${lesson.lessonID}`}
                              key={lessonIndex}
                            >
                              {`الدرس ${lesson.arabicTitle}`}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default DropdownMenu;
