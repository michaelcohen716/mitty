import React from "react";

function GeneralInput({ amount, onChange, placeholder }) {
  return (
    <input
      value={amount}
      onChange={onChange}
      className="no-background-input my-3"
      placeholder={placeholder}
    />
  );
}

export default GeneralInput;
