import React, { useEffect, useState } from "react";
import Row from "./Row";
import Table from "react-bootstrap/Table";

const Worksheet = () => {
  const defaultRows = [
    <Row key={0} onDelete={() => handleDelete(0)} />,
    <Row key={1} onDelete={() => handleDelete(1)} />,
    <Row key={2} onDelete={() => handleDelete(2)} />,
  ];
  const [rows, setRows] = useState(defaultRows);

  const addRow = () => {
    setRows([
      ...rows,
      <Row key={rows.length} onDelete={() => handleDelete(rows.length)} />,
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
          <tr>
            <th colSpan="5" className="text-capitalize">
              panels
            </th>
          </tr>
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
