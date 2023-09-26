import React, {useState} from "react";

import {Button} from "react-bootstrap";
import CustomButton from "./custom/CustomButton";
import InputRows from "./InputRows";

const Worksheet = (props) => {

const {optimizeData,totalCutLength,usedStockSheets,totalWastedArea,totalUsedArea,totalCuts,rows,setRows} = props


  const [inputValues, setInputValues] = useState({
    totalStockWidth: "",
    totalStockHeight: "",
  });


  const addRow = () => {
    const initialRow = {
      id: "",
      height: "",
      width: "",
      quantity: "",
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
    const {name, value} = e.target;
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        return {...row, [name]: value};
      }
      return row;
    });
    setRows(updatedRows);
  };
  const handleChange = (e) => {
    setInputValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDelete = (id) => {
    const updatedRows = rows.filter((row) => row.id !== id);
    setRows(updatedRows);
  };

  return (
    <div>
      {/* <p>
        Sheet Width:{" "}
        <input
          value={inputValues.totalStockWidth}
          type="text"
          id="totalStockWidth"
          name="totalStockWidth"
          onChange={handleChange}
        />
      </p> */}
      {/* <p>
        Sheet Height:{" "}
        <input
          value={inputValues.totalStockHeight}
          type="text"
          id="totalStockHeight"
          name="totalStockHeight"
          onChange={handleChange}
        />
      </p> */}
     <InputRows 
     handleDataChange={handleDataChange}
     handleInputFocus={handleInputFocus}
     handleInputBlur={handleInputBlur}
     rows={rows}
     handleDelete={handleDelete}
     addRow={addRow}
     name="Panels"
     />
     
      <Button
        onClick={optimizeData}
        className="me-lg-2 me-sm-0"
        variant="success"
      >
        <img
          alt=""
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{" "}
        Calculate
      </Button>
      <p>
        Used stock sheets:{" "}
        <input
          value={usedStockSheets}
          type="text"
          id="usedStockSheets"
          readonly
        />
      </p>
      <p>
        Total used area:{" "}
        <input type="text" value={totalUsedArea} id="totalUsedArea" readonly />
      </p>
      <p>
        Total wasted area:{" "}
        <input
          value={totalWastedArea}
          type="text"
          id="totalWastedArea"
          readonly
        />
      </p>
      <p>
        Total cuts:{" "}
        <input value={totalCuts} type="text" id="totalCuts" readonly />
      </p>
      <p>
        Total cut length:{" "}
        <input
          value={totalCutLength}
          type="text"
          id="totalCutLength"
          readonly
        />
      </p>
   
    </div>
  );
};

export default Worksheet;
