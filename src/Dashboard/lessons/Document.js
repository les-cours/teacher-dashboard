import React from "react";
import { useLocation, useParams } from "react-router-dom";

const Document = () => {
  const location = useLocation();
  const { lessonId } = useParams();

  const queryParams = new URLSearchParams(location.search);
  const documentID = queryParams.get("documentID");
  const documentLink = queryParams.get("documentLink");
  console.log(documentLink);
  return (
    <div>
      <h1>Lesson ID: {lessonId}</h1>
      <p>Document ID: {documentID}</p>

      {documentLink ? (
        <video controls width="600">
          <source src={documentLink} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p>No video link provided.</p>
      )}

      {/* Render other properties as needed */}
    </div>
  );
};

export default Document;
