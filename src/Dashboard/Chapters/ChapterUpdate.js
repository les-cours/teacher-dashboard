import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import "../chapters.css";
import { LOAD_CHAPTERS } from "../../GraphQl/Queries";

function ChapterUpdate() {
  let { classroomId, chapterId } = useParams();

  const { loading, error, data } = useQuery(LOAD_CHAPTERS, {
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
  console.log(chapterData);

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
    setIsEditable(false);
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
  return (
    <div className="chapterUpdate">
      <div>
        <h2>وحدة{chapterData.title} </h2>
      </div>

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
