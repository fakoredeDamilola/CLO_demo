import React, { useState } from "react";
import InputRows from "./InputRows";
import { v4 as uuidv4 } from "uuid";
import PasteContentModal from "./modal/PasteContentModal";

const Stocksheet = (props) => {
  const {
    stockSheetRows,
    setStockSheetRows,
    panelLabel,
    selectedFile,
    handleUpload,
    handleFileChange,
    setChangeIntialUnit,
    addMaterialToSheets,
    considerGrainDirection,
    handlePaste,
    fileInputRef,
    parseTableData,
  } = props;
  console.log({ stockSheetRows });

  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };
  const addRow = () => {
    setChangeIntialUnit(true);
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
    const uniqueID = uuidv4();
    const newRow = {
      ...initialRow,
      id: uniqueID,
    };
    setStockSheetRows([...stockSheetRows, newRow]);
  };

  const handleDataChange = (e, id) => {
    const { name, value } = e.target;
    const updatedRows = stockSheetRows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setStockSheetRows(updatedRows);
  };

  const handleSelect = (id) => {
    const updatedRows = stockSheetRows.map((row) => {
      if (row.id === id) {
        return { ...row, selected: !row.selected };
      }
      return row;
    });
    setStockSheetRows(updatedRows);
  };

  const changeGrainDirection = (newGrain, id) => {
    const updatedRows = stockSheetRows.map((row) => {
      if (row.id === id) {
        return { ...row, grainDirection: newGrain.name };
      }
      return row;
    });
    setStockSheetRows(updatedRows);
  };

  const handleDelete = (id) => {
    const updatedRows = stockSheetRows.filter((row) => row.id !== id);
    setStockSheetRows(updatedRows);
  };

  return (
    <div>
      <InputRows
        handleDataChange={handleDataChange}
        handleInputFocus={handleInputFocus}
        handleInputBlur={handleInputBlur}
        rows={stockSheetRows}
        panelLabel={panelLabel}
        addRow={addRow}
        addMaterialToSheets={addMaterialToSheets}
        handleDelete={handleDelete}
        name="Stock sheets"
        considerGrainDirection={considerGrainDirection}
        changeGrainDirection={changeGrainDirection}
        handleSelect={handleSelect}
        onPaste={handlePaste}
      />
      <div
        className="addContainer"
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="custom-upload-container">
          <input
            type="file"
            id="sheetFileInput"
            ref={fileInputRef}
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
        <PasteContentModal parseTableData={parseTableData} />
      </div>
    </div>
  );
};

export default Stocksheet;
