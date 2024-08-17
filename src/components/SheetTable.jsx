import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { RiArrowDropDownLine } from "react-icons/ri";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const SheetTable = ({ sheetStatistics }) => {
  const [open, setOpen] = useState(false);
  const [totalSheet, setTotalSheet] = useState(0);
  const [currentSheetDisplay, setCurrentSheetDisplay] = useState(1);
  const [sheetDisplay, setSheetDisplay] = useState({});

  useEffect(() => {
    if (sheetStatistics.length) {
      setOpen(true);
      const sheet = sheetStatistics[currentSheetDisplay - 1];
      setSheetDisplay(sheet);
      setTotalSheet(sheetStatistics.length);
      console.log({ sheet });
    }
  }, [sheetStatistics, currentSheetDisplay]);

  const selectNextSheet = (value) => {
    if (
      currentSheetDisplay + value > 0 &&
      currentSheetDisplay + value <= totalSheet
    ) {
      setCurrentSheetDisplay(currentSheetDisplay + value);
    }
  };

  const {
    stockSheetWidth,
    stockSheetHeight,
    usedArea,
    totalAreaUsedPercentage,
    wastedArea,
    totalWastedAreaPercentage,
    panels,
  } = sheetDisplay;
  return (
    <div>
      <div>
        <div id="example-collapse-text">
          <Table striped bordered hover width="50%">
            <thead>
              <tr>
                <th colSpan="2">
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", width: "100%" }}>
                      <h3 className="mr-5">Sheet statistics</h3>
                      <FaChevronLeft
                        style={{ cursor: "pointer", fontSize: "30px" }}
                        onClick={() => selectNextSheet(-1)}
                      />{" "}
                      <div
                        style={{
                          marginLeft: "10px",
                          marginRight: "10px",
                          fontSize: "20px",
                          marginTop: "0px",
                        }}
                      >
                        {" "}
                        {currentSheetDisplay} / {totalSheet}
                      </div>
                      <FaChevronRight
                        style={{ cursor: "pointer", fontSize: "30px" }}
                        onClick={() => selectNextSheet(1)}
                      />
                    </div>
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
              <tr>
                <td>Stock Sheet Dimensions</td>
                <td>
                  {stockSheetWidth} x {stockSheetHeight}
                </td>
              </tr>
              <tr>
                <td>Total Used Area</td>
                <td>
                  {usedArea} / {totalAreaUsedPercentage} %
                </td>
              </tr>
              <tr>
                <td>Total Wasted Area</td>
                <td>
                  {wastedArea} / {totalWastedAreaPercentage} %
                </td>
              </tr>
              <tr>
                <td>Panels</td>
                <td>{panels}</td>
              </tr>
              {/* <tr>
                <td>Total Cut Length</td>
                <td>{totalCutLength}</td>
              </tr>
              <tr>
                <td>Cut / Blade / Kerf Thickness</td>
                <td>{panelThickness}</td>
              </tr> */}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SheetTable;
