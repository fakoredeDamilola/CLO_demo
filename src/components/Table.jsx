import React, { useEffect, useState } from "react";
import Row from "./row";

const Table = () => {
  const defaultRows = [<Row key={0} />, <Row key={1} />, <Row key={2} />];
  const [rows, setRows] = useState(defaultRows);

  const addRow = () => {
    setRows([...rows, <Row key={rows.length} />]);
    console.log(rows);
  };

  useEffect(() => {
    const defaultRows = 5;

    for (let i = 0; i < defaultRows.length; i++) {
      addRow();
    }
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th colSpan="4">panels</th>
          </tr>
          <tr>
            <th colSpan="1">length</th>
            <th colSpan="1">width</th>
            <th colSpan="1">quantity</th>
            <th colSpan="1">result (screen reader only)</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      <button onClick={addRow}>Add Row</button>
    </div>
  );
};

// Todo: delete function
export default Table;
