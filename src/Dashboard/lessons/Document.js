import React from "react";

const Document = ({document}) => {

  return (
    <div>
      <p>{document.id}</p>

      {document.documentLink ? (
        <video controls >
          <source src={document.documentLink } type="video/mp4" />
        </video>
      ) : (
        <p>ليس هناك فيديو</p>
      )}

    </div>
  );
};

export default Document;
