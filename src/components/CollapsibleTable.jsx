import React, { useState } from "react";
import { Collapse, Button, Table } from "react-bootstrap";

const CollapsibleTable = ({
  totalUsedArea,
  totalUsedAreaPercentage,
  totalCutLength,
  totalCuts,
  sheetDetails,
  totalWastedArea,
  totalWastedAreaPercentage,
  panelThickness,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        className="mb-2"
      >
        Global Statistics
      </Button>
      <Collapse in={open}>
        <div id="example-collapse-text">
          <Table striped bordered hover width="50%">
            {/* <thead>
              <tr>
                <th>Column 1</th>
                <th>Column 2</th>
              </tr>
            </thead> */}
            <tbody>
              <tr>
                <td>Used Stock Sheets</td>
                <td>{sheetDetails.join(", ")}</td>
              </tr>
              <tr>
                <td>Total Used Area</td>
                <td>
                  {totalUsedArea} / {totalUsedAreaPercentage} %
                </td>
              </tr>
              <tr>
                <td>Total Wasted Area</td>
                <td>
                  {totalWastedArea} / {totalWastedAreaPercentage} %
                </td>
              </tr>
              <tr>
                <td>Total Cuts</td>
                <td>{totalCuts}</td>
              </tr>
              <tr>
                <td>Total Cut Length</td>
                <td>{totalCutLength}</td>
              </tr>
              <tr>
                <td>Cut / Blade / Kerf Thickness</td>
                <td>{panelThickness}</td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </Table>
        </div>
      </Collapse>
    </div>
  );
};

export default CollapsibleTable;
