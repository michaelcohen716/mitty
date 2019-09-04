import React from "react";
import "./common.css";

function SubmitButton({ onClick, disabled, className }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} enter-button d-flex justify-content-center`}
    >
      <div className="my-auto">Submit</div>
    </button>
  );
}

export default SubmitButton;
