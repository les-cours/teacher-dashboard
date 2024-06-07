import React from "react";
import { useParams } from "react-router-dom";
import jsonData from "../data.json";

function LessonDetails() {
  let { classroomId, chapterId, lessonId } = useParams();
  const classroom = jsonData.data.find(
    (item) => item.classroom.id === parseInt(classroomId)
  );
  const chapter = classroom
    ? classroom.classroom.chapters.find(
        (item) => item.id === parseInt(chapterId)
      )
    : null;
  const lesson = chapter
    ? chapter.lessons.find((item) => item.id === parseInt(lessonId))
    : null;
  const lessonDetails = lesson ? lesson : [];
  console.log(lessonDetails);
  if (!lesson) {
    return <div>No lesson found for this ID.</div>;
  }
  return (
    <div style={{ marginRight: "230px" }}>
      <div>
        <h2>الدرس {lessonId}</h2>
      </div>
      <div>
        <ul className="list">
          {lesson.pdf &&
            lesson.pdf.map((pdf, index) => (
              <div
                key={index}
                className="smallcontainer"
                style={{ backgroundColor: "pink" }}
              >
                {pdf}
              </div>
            ))}
          {/* Display videos */}
          {lesson.video &&
            lesson.video.map((video, index) => (
              <div key={index} className="smallcontainer">
                {video}
              </div>
            ))}
          <button
            className="smallcontainer"
            style={{ backgroundColor: "#4CAF50" }}
          >
            اضافة درس +
          </button>
        </ul>
      </div>
    </div>
  );
}

export default LessonDetails;
