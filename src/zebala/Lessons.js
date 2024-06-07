import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import jsonData from "./data.json";
import "./chapters.css";
function Lessons() {
  let { classroomId, chapterId } = useParams();
  const classroom = jsonData.data.find(
    (item) => item.classroom.id === parseInt(classroomId)
  );
  const chapter = classroom
    ? classroom.classroom.chapters.find(
        (item) => item.id === parseInt(chapterId)
      )
    : null;

  const lessons = chapter ? chapter.lessons : [];
  console.log(lessons);

  const [isFormVisible, setFormVisible] = useState(false);
  const addLesson = () => {
    setFormVisible(true);
  };
  const [formData, setFormData] = useState({
    title: "",
    arabicTitle: "",
    discription: "",
    arabicDescription: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log(formData);

    setFormVisible(false);
  };
  return (
    <div className="chapters" style={{ marginRight: "200px" }} >
      <div>
        <h2>دروس الوحدة {chapterId}</h2>
      </div>
      {isFormVisible ? (
        <div className="form-container">
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
              placeholder=" اسم الدرس باللاتينية"
              required
            />
            <input
              type="text"
              name="discription"
              value={formData.discription}
              onChange={handleChange}
              placeholder="وصف الدرس"
              required
            />
            <input
              type="text"
              name="arabicDescription"
              value={formData.arabicDescription}
              onChange={handleChange}
              placeholder=" وصف الدرس باللاتينية"
              required
            />
            <button type="submit">إضافة</button>
            <button type="button" onClick={() => setFormVisible(false)}>
              إلغاء
            </button>
          </form>
        </div>
      ) : (
        <div>
          <ul className="list">
            {lessons &&
              lessons.map((lesson, index) => (
                <Link
                  to={`/dashboard/classrooms/${classroomId}/${chapterId}/${lesson.id}`}
                  className="smallcontainer"
                  key={index}
                >{`الدرس ${lesson.id}`}</Link>
              ))}
            <button
              onClick={addLesson}
              className="smallcontainer"
              style={{ backgroundColor: "#4CAF50" }}
            >
              اضافة درس +
            </button>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Lessons;
