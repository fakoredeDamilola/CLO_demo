import React, { useEffect, useState } from "react";
import Row from "./Row";
import Table from "react-bootstrap/Table";
import panelLogoIcon from "../assets/icons/construction-clipboard.svg";

const Worksheet = ({ onDataChange, onOptimization }) => {
  const defaultRows = [
    <Row
      key={0}
      onDelete={() => handleDelete(0)}
      onDataChange={onDataChange}
      onOptimization={onOptimization}
    />,
    <Row
      key={1}
      onDelete={() => handleDelete(1)}
      onDataChange={onDataChange}
      onOptimization={onOptimization}
    />,
    <Row
      key={2}
      onDelete={() => handleDelete(2)}
      onDataChange={onDataChange}
      onOptimization={onOptimization}
    />,
  ];
  const [rows, setRows] = useState(defaultRows);

  const addRow = () => {
    setRows([
      ...rows,
      <Row
        key={rows.length}
        onDelete={() => handleDelete(rows.length)}
        onDataChange={onDataChange}
        onOptimization={onOptimization}
      />,
    ]);
  };

  const handleDelete = (index) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows.splice(index, 1);
      return updatedRows;
    });
  };

  useEffect(() => {
    const defaultRows = 5;

    for (let i = 0; i < defaultRows; i++) {
      addRow();
    }
  }, []);

  return (
    <div>
      <Table striped borderless hover variant="dark" size="sm" responsive>
        <thead>
          {/* <tr>
            <th colSpan="5" className="text-capitalize">
              <img
                src={panelLogoIcon}
                alt=""
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              {title}
            </th>
          </tr> */}
          <tr>
            <th colSpan="1" className="text-capitalize">
              length
            </th>
            <th colSpan="1" className="text-capitalize">
              width
            </th>
            <th colSpan="1" className="text-capitalize">
              quantity
            </th>
            <th colSpan="1" className="text-capitalize">
              result
            </th>
            <th colSpan="1" className="capitalize"></th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <button onClick={addRow}>Add Row</button>
    </div>
  );
};

export default Worksheet;
