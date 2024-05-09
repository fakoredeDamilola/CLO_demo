import React, { useEffect, useState } from "react";

import { Button } from "react-bootstrap";
import InputRows from "./InputRows";

const Worksheet = (props) => {
  // const { optimizeData, rows, setRows, panelLabel } = props;
  const { rows, setRows, inputValues, setInputValues, panelLabel } = props;
  const addRow = () => {
    const initialRow = {
      id: "",
      height: "",
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
      />
    </div>
  );
};

export default Worksheet;
