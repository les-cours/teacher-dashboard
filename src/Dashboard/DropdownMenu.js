import React, { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link, useParams } from 'react-router-dom';
import './DropdownMenu.css';
import { LOAD_CLASSROOMS } from '../GraphQl/Queries';
const DropdownMenu = ({ teacherID }) => {
  let { classroomId,chapterId} = useParams();

  const { loading, error, data ,refetch} = useQuery(LOAD_CLASSROOMS, {
    variables: { teacherID },
  });

  const [chapterVisibility, setChapterVisibility] = useState([]);
  const [lessonVisibility, setLessonVisibility] = useState([]);
  useEffect(() => {
    if (data && data.classRoomsTeacher) {
      const initialVisibilityState = data.classRoomsTeacher.map(() => false);
      setChapterVisibility(initialVisibilityState);
      setLessonVisibility(initialVisibilityState);
    }
  }, [data]);

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
    // Handle adding a chapter
    console.log(`Add chapter to classroom ${classroomId}`);
  };

  const handleAddLesson = (chapterId) => {
    // Handle adding a lesson
    console.log(`Add lesson to chapter ${chapterId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="dropdown-menu">
      {data && data.classRoomsTeacher && data.classRoomsTeacher.map((item, classroomIndex) => (
        <div key={classroomIndex} className="classroom">
          <Link
            to={`/dashboard/classrooms/${item.classRoomID}`}
            className="classroom-btn"
            onClick={() => toggleChapterVisibility(classroomIndex)}
          >
            {`القسم ${item.arabicTitle}`}
          </Link>
          {chapterVisibility[classroomIndex] && (
            <div className="dropdown-content">
              {item.chapters && item.chapters.map((chapter, chapterIndex) => (
                <div key={chapterIndex} className="chapters">
                  <Link
                    to={`/dashboard/classrooms/${item.classRoomID}/${chapter.chapterID}`}
                    onClick={() => toggleLessonVisibility(chapterIndex)}
                  >
                    {`الوحدة ${chapter.arabicTitle}`}
                  </Link>
                  {lessonVisibility[chapterIndex] && (
                    <div className="lessons">
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <Link
                          to={`/dashboard/classrooms/${item.classRoomID}/${chapter.chapterID}/${lesson.lessonID}`}
                          key={lessonIndex}
                        >
                          {`الدرس ${lesson.arabicTitle}`}
                        </Link>
                      ))}
                      <Link to={{pathname:`classrooms/${classroomId}/${chapterId}/addLesson`}} onClick={() => handleAddLesson(chapter.chapterID)}>Add Lesson</Link>
                    </div>
                  )}
                </div>
              ))}
              <Link to={`classrooms/${classroomId}/addChapter`} >Add Chapter</Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DropdownMenu;
