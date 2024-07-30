import React, { useRef, useState } from "react";
import InputRows from "./InputRows";

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
    setChangeIntialUnit(true);
    const initialRow = {
      id: "",
      length: "",
      width: "",
      quantity: "",
      label: "",
      material: "",
    };
    const newRowId = Date.now().toString();
    const newRow = {
      ...initialRow,
      id: newRowId,
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
