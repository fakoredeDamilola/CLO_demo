import React, { useState } from "react";
import Worksheet from "./Worksheet";
import InputRows from "./InputRows";

const Stocksheet = (props) => {
 const {stockRows,setStockRows} = props
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
  };
  const newRowId = Date.now().toString();
  const newRow = {
    ...initialRow,
    id: newRowId,
  };
  setStockRows([...stockRows, newRow]);
};

const handleDataChange = (e, id) => {
  const {name, value} = e.target;
  const updatedRows = stockRows.map((row) => {
    if (row.id === id) {
      return {...row, [name]: value};
    }
    return row;
  });
  setStockRows(updatedRows);
};

const handleDelete = (id) => {
  const updatedRows = stockRows.filter((row) => row.id !== id);
  setStockRows(updatedRows);
};



  return (<div>
    <InputRows 
  handleDataChange={handleDataChange}
  handleInputFocus={handleInputFocus}
  handleInputBlur={handleInputBlur}
  rows={stockRows}
  addRow={addRow}
  handleDelete={handleDelete}
  name="Stock sheets"
  />
    </div>);
};

export default Stocksheet;
