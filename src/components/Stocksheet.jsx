import React, { useRef, useState } from "react";
import InputRows from "./InputRows";

const Stocksheet = (props) => {
  const {
    stockRows,
    setStockRows,
    panelLabel,
    selectedFile,
    handleUpload,
    handleFileChange,
  } = props;

  const fileSheetRef = useRef(null);
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };
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
    setStockRows([...stockRows, newRow]);
  };

  const handleDataChange = (e, id) => {
    const { name, value } = e.target;
    const updatedRows = stockRows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setStockRows(updatedRows);
  };

  const handleDelete = (id) => {
    const updatedRows = stockRows.filter((row) => row.id !== id);
    setStockRows(updatedRows);
  };

  return (
    <div>
      <InputRows
        handleDataChange={handleDataChange}
        handleInputFocus={handleInputFocus}
        handleInputBlur={handleInputBlur}
        rows={stockRows}
        panelLabel={panelLabel}
        addRow={addRow}
        handleDelete={handleDelete}
        name="Stock sheets"
      />
      <div className="custom-upload-container">
        <input
          type="file"
          id="sheetFileInput"
          ref={fileSheetRef}
          name="sheets"
          style={{ display: "none" }}
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />
        <label htmlFor="sheetFileInput" className="custom-upload-button">
          {selectedFile
            ? `Selected File: ${selectedFile.name}`
            : `Choose an Excel file for sheets`}
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

export default Stocksheet;
