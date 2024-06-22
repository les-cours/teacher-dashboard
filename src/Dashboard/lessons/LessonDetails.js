import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Popup from "reactjs-popup";
import AddDocument from "./addDocument";
import { DELETE_DOCUMENT } from "../../GraphQl/Mutations";
import LessonUpdate from "./LessonUpdate";
import { LOAD_LESSON_DETAILS } from "../../GraphQl/Queries";
import styles from "./lesson.module.css";
import Document from "./Document";
import DocumentDetails from "./DocumentDetails";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faFilePdf,
  faVideo,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import PopupModel from "../../components/Popup";

export const GET_DOCUMENTS = gql`
  query GetDocuments($lessonID: String!) {
    documents(lessonID: $lessonID) {
      documentID
      documentType
      title
      arabicTitle
      description
      arabicDescription
      duration {
        hours
        minutes
        seconds
      }
      lectureNumber
      documentLink
    }
  }
`;

function LessonDetails() {
  let { classroomId, chapterId, lessonId } = useParams();

  const { loading, error, data } = useQuery(LOAD_LESSON_DETAILS, {
    variables: { chapterID: chapterId },
  });
  const {
    loading1,
    error1,
    data: documentsData,
  } = useQuery(GET_DOCUMENTS, {
    variables: { lessonID: lessonId },
  });

  const [documents, setDocuments] = useState([]);
  const [viewingVideo, setViewingVideo] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null); // State to hold the selected document/video
  const navigate = useNavigate();
  const [deleteDocument] = useMutation(DELETE_DOCUMENT);

  useEffect(() => {
    if (documentsData) {
      setDocuments(documentsData.documents);
    }
  }, [documentsData]);

  if (loading || loading1) return <p>جار التحميل...</p>;
  if (error || error1) return <p>خطأ: {error.message || error1.message}</p>;

  const lesson = data.lessons.find((item) => item.lessonID === lessonId);

  if (!lesson) {
    return <div>لم يتم العثور على درس لهذا المعرف.</div>;
  }

  const handleDeleteDocument = async (documentID, close) => {
    try {
      console.log("document:", documentID);
      const { data } = await deleteDocument({ variables: { documentID } });
      if (data.deleteDocument.succeeded) {
        close();
        // Update documents list without reloading the page
        setDocuments(documents.filter((doc) => doc.documentID !== documentID));
      } else {
        alert("فشل في حذف الملف");
      }
    } catch (error) {
      alert("خطأ في حذف الملف: " + error.message);
    }
  };

  const videoOnclickHandler = (document) => {
    // Set the selected document/video to display in Document component
    setSelectedDocument(document);
    setViewingVideo(true); // Set viewingVideo to true to render Document component
  };

  const backToTableHandler = () => {
    setViewingVideo(false); // Set viewingVideo back to false to render the table view
    setSelectedDocument(null); // Clear selectedDocument when returning to table view
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
            {(close) => <LessonUpdate />}
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
                  <h2>تأكيد حذف الدرس</h2>
                  <p>هل أنت متأكد من حذف هذا الدرس</p>
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

      {/* Conditional rendering based on viewingVideo state */}
      {viewingVideo && selectedDocument ? (
        <div className={styles.documentViewer}>
          {/* Render Document component */}
          
          <button onClick={backToTableHandler}>العودة إلى الجدول</button>
          <DocumentDetails document={selectedDocument}/>
          
        </div>
      ) : (
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
                        onClick={() => videoOnclickHandler(document)}
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
      )}
    </div>
  );
}

export default LessonDetails;
