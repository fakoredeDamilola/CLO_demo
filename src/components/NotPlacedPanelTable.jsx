import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { RiArrowDropDownLine } from "react-icons/ri";

const NotPlacedPanelTable = ({ notPlacedPanelArray }) => {
  console.log({ notPlacedPanelArray });
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div id="example-collapse-text">
        <Table striped bordered hover width="50%">
          <thead>
            <tr>
              <th
                colSpan="2"
                style={{ backgroundColor: "#D21004", color: "white" }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ marginTop: "4px" }}>Not Placed Panels</div>
                  <div>
                    <RiArrowDropDownLine
                      onClick={() => setOpen(!open)}
                      style={{ cursor: "pointer", fontSize: "40px" }}
                    />
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody style={{ display: open ? "table" : "none", width: "100%" }}>
            <tr style={{ backgroundColor: "lightgray" }}>
              <td>Panel Size</td>
              <td>Quantity</td>
            </tr>
            {notPlacedPanelArray.map((panel) => (
              <tr>
                <td>
                  {panel.panelWidth} x {panel.panelLength}
                </td>
                <td>{panel.panelCount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default NotPlacedPanelTable;
