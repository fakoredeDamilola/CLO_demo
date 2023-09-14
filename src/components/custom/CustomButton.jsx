import React from "react";

const CustomButton = ({backgroundColor, width = "auto", children, onClick}) => {
  const buttonStyle = {
    backgroundColor,
    width,
    padding: "10px 20px", // You can customize the padding as desired
    border: "none",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer",
    borderRadius: "4px",
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};

export default CustomButton;
