import React, { useEffect, useRef, useState } from "react";
import { FaArrowsAltH, FaArrowsAltV } from "react-icons/fa";
import { TiStarburst } from "react-icons/ti";
import InputRows from "./InputRows";

const Panelsheet = (props) => {
  const {
    panelRows,
    setPanelRows,
    panelLabel,
    handleFileChange,
    selectedFile,
    handleUpload,
    setChangeIntialUnit,
    addMaterialToSheets,
    considerGrainDirection,
  } = props;
  const fileInputRef = useRef(null);
  const addRow = () => {
    const initialRow = {
      id: "",
      length: "",
      width: "",
      quantity: "",
      label: "",
      material: "",
      selected: true,
      grainDirection: "vertical",
    };
    const newRowId = Date.now().toString();
    const newRow = {
      ...initialRow,
      id: newRowId,
    };
    setPanelRows([...panelRows, newRow]);
    setChangeIntialUnit(true);
  };
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleSelect = (id) => {
    const updatedRows = panelRows.map((row) => {
      if (row.id === id) {
        return { ...row, selected: !row.selected };
      }
      return row;
    });
    setPanelRows(updatedRows);
  };

  const changeGrainDirection = (newGrain, id) => {
    const updatedRows = panelRows.map((row) => {
      if (row.id === id) {
        return { ...row, grainDirection: newGrain.name };
      }
      return row;
    });
    setPanelRows(updatedRows);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleDataChange = (e, id) => {
    const { name, value } = e.target;
    const updatedRows = panelRows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setPanelRows(updatedRows);
  };

  const handleDelete = (id) => {
    const updatedRows = panelRows.filter((row) => row.id !== id);
    setPanelRows(updatedRows);
  };

  return (
    <div>
      <InputRows
        handleDataChange={handleDataChange}
        handleInputFocus={handleInputFocus}
        handleInputBlur={handleInputBlur}
        rows={panelRows}
        panelLabel={panelLabel}
        addMaterialToSheets={addMaterialToSheets}
        handleDelete={handleDelete}
        addRow={addRow}
        name="Panels"
        handleUpload={handleUpload}
        selectedFile={selectedFile}
        considerGrainDirection={considerGrainDirection}
        changeGrainDirection={changeGrainDirection}
        handleSelect={handleSelect}
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

export default Panelsheet;
