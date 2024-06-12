// src/components/LessonDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Popup from "reactjs-popup";
import AddDocument from "./addDocument";
import { DELETE_DOCUMENT } from "../../GraphQl/Mutations";
import LessonUpdate from "./LessonUpdate";
import { LOAD_LESSON_DETAILS } from "../../GraphQl/Queries";
function LessonDetails() {
  let { classroomId, chapterId, lessonId } = useParams();

  const { loading, error, data } = useQuery(LOAD_LESSON_DETAILS, {
    variables: { chapterID: chapterId },
  });
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (data) {
      const lesson = data.lessons.find((item) => item.lessonID === lessonId);
      if (lesson) {
        setDocuments(lesson.documents);
      }
    }
  }, [data, lessonId]);
  const [deleteDocument] = useMutation(DELETE_DOCUMENT);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const lesson = data.lessons.find((item) => item.lessonID === lessonId);

  if (!lesson) {
    return <div>No lesson found for this ID.</div>;
  }
  const handleDeleteDocument = async (documentID, close) => {
    try {
      const { data } = await deleteDocument({ variables: { documentID } });
      if (data.deleteDocument.succeeded) {
        // Refetch the lesson details to update the UI
        // or you can manually remove the document from the UI state if preferred
        close();
        window.location.reload();
      } else {
        alert("Failed to delete the document");
      }
    } catch (error) {
      alert("Error deleting document: " + error.message);
    }
  };
  return (
    <div style={{ marginRight: "230px", width: "500px" }}>
      <div>
        <h2>درس {lesson.arabicTitle}</h2>
        <Popup
          className="popup"
          trigger={
            <button style={{ position: "relative", backgroundColor: "blue" }}>
              تعديل الدرس{" "}
            </button>
          }
          modal
          nested
        >
          {(close) => (
            <div className="modal">
              <div className="contentPop">
                <LessonUpdate />
              </div>
            </div>
          )}
        </Popup>
        <Popup
                    className="popup"
                    trigger={
                      <button
                        style={{ position: "relative", backgroundColor: "red" }}
                      >
                        حدف الدرس
                      </button>
                    }
                    modal
                    nested
                  >
                    {(close) => (
                      <div className="modalDelete">
                        <div className="contentPop">
                          <div>
                            <h2>حدف الدرس</h2>

                            <div className="buttonDiv">
                              <button
                                style={{ backgroundColor: "#ff4646" }}
                                onClick={() => close()}
                              >
                                الغاء
                              </button>

                              <button
                                style={{ backgroundColor: "#ff4646" }}
                                onClick={() =>
                                  handleDeleteDocument(
                                    document.documentID,
                                    close
                                  )
                                }
                              >
                                حدف
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Popup>
      </div>
      <div>
        <h3>العنوان : {lesson.arabicTitle}</h3>
        <p>الوصف : {lesson.arabicDescription}</p>
        <h3>Documents:</h3>
        <Popup
          className="popup"
          trigger={
            <button style={{ position: "relative", backgroundColor: "blue" }}>
              + اضافة ملف
            </button>
          }
          modal
          nested
        >
          {(close) => (
            <div className="modal">
              <div className="contentPop">
                <div>
                  <h2> اضافة ملف</h2>
                  <AddDocument />
                  <div className="buttonDiv">
                    <button
                      style={{ backgroundColor: "#ff4646" }}
                      onClick={() => close()}
                    >
                      الغاء
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Popup>
        <table className="documentTable" border="1">
          <thead>
            <tr>
              <th>Lecture Number</th>
              <th>document type</th>

              <th>Arabic Title</th>
              <th>Arabic Description</th>
              <th>Duration</th>
              <th>Document Link</th>
              <th>update</th>
              <th>delete</th>
            </tr>
          </thead>
          <tbody>
            {lesson.documents.map((document) => (
              <tr key={document.documentID}>
                <td>{document.lectureNumber}</td>
                <td>{document.documentType}</td>

                <td>{document.arabicTitle}</td>
                <td>{document.arabicDescription}</td>
                <td>
                  {document.duration.hours}h {document.duration.minutes}m{" "}
                  {document.duration.seconds}s
                </td>
                <td>
                  <a
                    href={document.documentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {document.documentLink}
                  </a>
                </td>
                <td>
                  <button>update</button>
                </td>
                <td>
                  <Popup
                    className="popup"
                    trigger={
                      <button
                        style={{ position: "relative", backgroundColor: "red" }}
                      >
                        حدف ملف
                      </button>
                    }
                    modal
                    nested
                  >
                    {(close) => (
                      <div className="modalDelete">
                        <div className="contentPop">
                          <div>
                            <h2>حدف الملف</h2>

                            <div className="buttonDiv">
                              <button
                                style={{ backgroundColor: "#ff4646" }}
                                onClick={() => close()}
                              >
                                الغاء
                              </button>

                              <button
                                style={{ backgroundColor: "#ff4646" }}
                                onClick={() =>
                                  handleDeleteDocument(
                                    document.documentID,
                                    close
                                  )
                                }
                              >
                                حدف
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Popup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LessonDetails;
