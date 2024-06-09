import React, { useEffect, useRef, useState } from "react";

import { Button } from "react-bootstrap";
import InputRows from "./InputRows";

const Worksheet = (props) => {
  // const { optimizeData, rows, setRows, panelLabel } = props;
  const {
    rows,
    setRows,
    panelLabel,
    handleFileChange,
    selectedFile,
    handleUpload,
  } = props;
  const fileInputRef = useRef(null);
  const addRow = () => {
    const initialRow = {
      id: "",
      length: "",
      width: "",
      quantity: "",
      label: "",
    };
    const newRowId = Date.now().toString();
    const newRow = {
      ...initialRow,
      id: newRowId,
    };
    setRows([...rows, newRow]);
  };
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleDataChange = (e, id) => {
    const { name, value } = e.target;
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const handleDelete = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  return (
    <div>
      <InputRows
        handleDataChange={handleDataChange}
        handleInputFocus={handleInputFocus}
        handleInputBlur={handleInputBlur}
        rows={rows}
        panelLabel={panelLabel}
        handleDelete={handleDelete}
        addRow={addRow}
        name="Panels"
        handleUpload={handleUpload}
        selectedFile={selectedFile}
      />
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
            : `Choose an Excel file for panels`}
        </label>
        {selectedFile && (
          <button onClick={handleUpload} className="custom-upload-button">
            Upload
          </button>
        )}
      </div>
    </div>
  );
};

export default Worksheet;
