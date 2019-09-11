import React from "react";
import "./common.css";

function ViewHolder({ children, headlineText }) {
  return (
    <div className="d-flex flex-column view-holder justify-content-start">
      <div className="d-flex flex-column mt-4">
        <div className="headline mb-3">{headlineText}</div>
        {children}
      </div>
    </div>
  );
}

export default ViewHolder;
