import React from "react";
import "./common.css";

function SubmitButton({ onClick, disabled, className, text }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} enter-button d-flex justify-content-center`}
    >
      <div className="my-auto">{text}</div>
    </button>
  );
}

export default SubmitButton;
