import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import "../chapters.css";
import { LOAD_CHAPTERS } from "../../GraphQl/Queries";
import Popup from "reactjs-popup";
import { DELETE_CHAPTER } from "../../GraphQl/Mutations";
import { UPDATE_CHAPTER } from "../../GraphQl/Mutations"; // Make sure this path is correct

function ChapterUpdate() {
  let { classroomId, chapterId } = useParams();
  const navigate = useNavigate();

  const { loading, error, data ,refetch} = useQuery(LOAD_CHAPTERS, {
    variables: { classRoomID: classroomId },
  });

  const [chapter, setChapter] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [chapterData, setChapterData] = useState({
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
      const foundChapter = data.chapters.find(
        (item) => item.chapterID === chapterId
      );
      setChapter(foundChapter);
      console.log(foundChapter.title);
      if (foundChapter) {
        setChapterData({
          title: foundChapter.title,
          arabicTitle: foundChapter.arabicTitle,
          description: foundChapter.description,
          arabicDescription: foundChapter.arabicDescription,
        });
      }
    }
  }, [data, chapterId]);

  const [deleteChapter] = useMutation(DELETE_CHAPTER, {
    onCompleted: () => {
      console.log("Chapter deleted successfully.");
      navigate(`/classroom/${classroomId}`);
    },
    onError: (err) => {
      console.error("Error deleting chapter:", err);
    },
  });

  if (loading) return <p>Loading...</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChapterData((prevData) => ({
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
          title: chapterData.title,
          arabicTitle: chapterData.arabicTitle,
          description: chapterData.description,
        },
      });
      setIsEditable(false);
    } catch (err) {
      console.error("Error updating chapter:", err);
    }
  };

  const handleIgnore = () => {
    if (chapter) {
      setChapterData({
        title: chapter.title,
        arabicTitle: chapter.arabicTitle,
        description: chapter.description,
        arabicDescription: chapter.arabicDescription,
      });
    }
    setIsEditable(false);
  };

  const handleDelete = async () => {
    await deleteChapter({ variables: { id: chapterId } });
  };

  return (
    <div className="chapterUpdate">
      <div>
        <h2>وحدة{chapterData.arabicTitle} </h2>
      </div>
      <Popup
        className="popup"
        trigger={
          <button style={{ position: "relative", backgroundColor: "red" }}>
            حدف
          </button>
        }
        modal
        nested
      >
        {(close) => (
          <div className="modal">
            <div className="contentPop">
              <div>
                <h2>حدف وحدة</h2>
                <div className="buttonDiv">
                  <button
                    style={{ backgroundColor: "#ff4646" }}
                    onClick={() => close()}
                  >
                    الغاء
                  </button>
                  <button
                    style={{ backgroundColor: "#41d06c" }}
                    onClick={async () => {
                      await handleDelete();
                      close();
                    }}
                  >
                    حدف
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Popup>
      <div className="chapter-form">
        <form onSubmit={handleSave}>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={chapterData.title}
            disabled={!isEditable}
            onChange={handleInputChange}
          />
          <label>Arabic Title:</label>
          <input
            type="text"
            name="arabicTitle"
            value={chapterData.arabicTitle}
            disabled={!isEditable}
            onChange={handleInputChange}
          />
          <label>Description:</label>
          <textarea
            name="description"
            value={chapterData.description}
            disabled={!isEditable}
            onChange={handleInputChange}
          />
          <label>Arabic Description:</label>
          <textarea
            name="arabicDescription"
            value={chapterData.arabicDescription}
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

export default ChapterUpdate;
