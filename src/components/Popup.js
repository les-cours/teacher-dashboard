import React from "react";

function PopupModel({ children }) {
  return <div className="modal" style={{overflow:"auto"}}>{children}</div>;
}

export default PopupModel;
