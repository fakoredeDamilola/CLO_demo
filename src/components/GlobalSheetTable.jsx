import React, { useState } from "react";
import { Collapse, Button, Table } from "react-bootstrap";

const GlobalSheetTable = ({ globalSheetStatistics }) => {
  const [open, setOpen] = useState(false);

  const {
    totalAreaUsed,
    totalUsedAreaPercentage,
    totalCutLength,
    totalCuts,
    sheetDetails,
    totalWastedArea,
    totalWastedAreaPercentage,
    panelThickness,
    notPlacedPanel,
    totalParts,
    totalSheetUsed,
  } = globalSheetStatistics;

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
            <tbody>
              <tr>
                <td>Total Used Stock Sheets</td>
                <td>{totalSheetUsed}</td>
              </tr>
              <tr>
                <td>Used Stock Sheets</td>
                <td>{sheetDetails.join(", ")}</td>
              </tr>
              <tr>
                <td>Total Used Area</td>
                <td>
                  {totalAreaUsed} / {totalUsedAreaPercentage} %
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
                <td>Not Placed Panels</td>
                <td>{notPlacedPanel.length}</td>
              </tr>
              <tr>
                <td>Cut / Blade / Kerf Thickness</td>
                <td>{panelThickness}</td>
              </tr>
              <tr>
                <td>Total Parts</td>
                <td>{totalParts}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Collapse>
    </div>
  );
};

export default GlobalSheetTable;
