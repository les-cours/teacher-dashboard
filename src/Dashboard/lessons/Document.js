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
      <p>{documentID}</p>

      {documentLink ? (
        <video controls width="600">
          <source src={documentLink} type="video/mp4" />
        </video>
      ) : (
        <p>ليس هناك فيديو</p>
      )}

    </div>
  );
};

export default Document;
