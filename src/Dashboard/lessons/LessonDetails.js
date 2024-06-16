import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Popup from "reactjs-popup";
import AddDocument from "./addDocument";
import { DELETE_DOCUMENT } from "../../GraphQl/Mutations";
import LessonUpdate from "./LessonUpdate";
import { LOAD_LESSON_DETAILS } from "../../GraphQl/Queries";
import styles from "./lesson.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faFilePdf,
  faVideo,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import PopupModel from "../../components/Popup";

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
  if (loading) return <p>جار التحميل...</p>;
  if (error) return <p>خطأ: {error.message}</p>;

  const lesson = data.lessons.find((item) => item.lessonID === lessonId);

  if (!lesson) {
    return <div>لم يتم العثور على درس لهذا المعرف.</div>;
  }
  const handleDeleteDocument = async (documentID, close) => {
    try {
      console.log("document:", documentID);
      const { data } = await deleteDocument({ variables: { documentID } });
      if (data.deleteDocument.succeeded) {
        // Refetch the lesson details to update the UI
        // or you can manually remove the document from the UI state if preferred
        close();
        window.location.reload();
      } else {
        alert("فشل في حذف الملف");
      }
    } catch (error) {
      alert("خطأ في حذف الملف: " + error.message);
    }
  };
  return (
    <div className={styles.lesson}>
      <div className={styles.lessonHeader}>
        <div>
          <h2># درس {lesson.arabicTitle}</h2>
          <p>{lesson.arabicDescription}</p>
        </div>

        <div className={styles.lessonHeaderBtns}>
          <Popup
            className="popup"
            trigger={
              <button>
                <FontAwesomeIcon icon={faEdit} /> تعديل الدرس
              </button>
            }
            modal
            nested
          >
            {(close) => (
              
                  <LessonUpdate />
                
            )}
          </Popup>
          <Popup
            className={styles.popupDelete}
            trigger={
              <button>
                <FontAwesomeIcon icon={faTrashAlt} /> حذف الدرس
              </button>
            }
            modal
            nested
          >
            {(close) => (
              <PopupModel>
                <div style={{ marginRight: "100px" }}>
                  <h2>تأكيد حدف الدرس</h2>
                  <p>هل أنت متأكد من حدف هدا الدرس</p>
                </div>

                <div className={styles.buttonDiv}>
                  <button
                    style={{
                      padding: "8px 20px",
                    }}
                    onClick={() => close()}
                  >
                    إلغاء
                  </button>
                  <button
                    style={{
                      padding: "8px 20px",
                      backgroundColor: "rgb(235, 114, 114)",
                    }}
                    onClick={() => {
                      console.log("الدرس");
                    }}
                  >
                    حذف
                  </button>
                </div>
              </PopupModel>
            )}
          </Popup>
          <Popup
            className="popup"
            trigger={
              <button>
                <FontAwesomeIcon icon={faPlus} />
                إضافة ملف
              </button>
            }
            modal
            nested
          >
            {(close) => (
              <PopupModel close={close} title={""}>
                <AddDocument />
              </PopupModel>
            )}
          </Popup>
        </div>
      </div>

      <table className={styles.documentTable} border="1">
        <thead>
          <tr>
            <th></th>

            <th>العنوان</th>
            <th>الوصف</th>
            <th>المدة</th>
            <th>رابط الملف</th>
          </tr>
        </thead>
        <tbody>
          {lesson.documents.map((document) => (
            <tr key={document.documentID}>
              <td>{document.lectureNumber}</td>

              <td>{document.arabicTitle}</td>
              <td>{document.arabicDescription}</td>
              <td>
                {document.documentType === "pdf" ? (
                  <>/</>
                ) : (
                  <div>
                    {document.duration.hours}س {document.duration.minutes}د{" "}
                    {document.duration.seconds}ث
                  </div>
                )}
              </td>

              <td className={styles.actions}>
                <button>
                  {document.documentType === "pdf" ? (
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      color="var(--primary-color)"
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={faVideo}
                      color="var(--secondary-color)"
                    />
                  )}
                </button>

                <button>
                  <FontAwesomeIcon icon={faEdit} color="var(--third-color)" />
                </button>
                <Popup
                  className={styles.popup}
                  trigger={
                    <button>
                      <FontAwesomeIcon icon={faTrashAlt} color="#C80036" />
                    </button>
                  }
                  modal
                  nested
                >
                  {(close) => (
                    <div className={styles.modalDelete}>
                      <div className={styles.contentPop}>
                        <div>
                          <h2>تأكيد حدف الملف</h2>
                          <p>هل أنت متأكد من حدف هدا الملف</p>

                          <div className={styles.buttonDiv}>
                            <button onClick={() => close()}>إلغاء</button>

                            <button
                              className={styles.delete}
                              onClick={handleDeleteDocument.bind(
                                this,
                                document.documentID,
                                close
                              )}
                            >
                              حذف
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
  );
}

export default LessonDetails;
