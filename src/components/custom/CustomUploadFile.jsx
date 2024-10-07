import React from "react";
import { Spinner } from "react-bootstrap";

const CustomUploadFile = ({
  fileInputRef,
  handleFileChange,
  selectedFile,
  handleUpload,
  type,
  uploadFileSpinner,
}) => {
  return (
    <div className="custom-upload-container">
      <input
        type="file"
        id="stockFileInput"
        ref={fileInputRef}
        name="panels"
        style={{ display: "none" }}
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />
      <label htmlFor="stockFileInput" className="custom-upload-button">
        {selectedFile
          ? `Selected File: ${selectedFile.name}`
          : `Choose an Excel file for ${type}`}
      </label>
      {selectedFile && (
        <button onClick={handleUpload} className="custom-upload-button">
          {uploadFileSpinner ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Loading...
            </>
          ) : (
            "Load Data"
          )}
        </button>
      )}
    </div>
  );
};

export default CustomUploadFile;
