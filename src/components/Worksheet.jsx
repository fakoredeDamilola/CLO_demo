import React, {useState} from "react";

import Table from "react-bootstrap/Table";
import panelLogoIcon from "../assets/icons/construction-clipboard.svg";
import {Button} from "react-bootstrap";
import CustomButton from "./custom/CustomButton";

const Worksheet = () => {
  const [rows, setRows] = useState([
    {id: 1, height: "", quantity: "", width: "", result: ""},
  ]);
  const [stockWidth, setStockWidth] = useState(0);
  const [totalCutLength, setTotalCutLength] = useState(0);
  const [usedStockSheets, setUsedStockSheets] = useState("");
  const [stockSheetStyle, setStockSheetStyle] = useState({
    width: "0",
    height: "0",
  });
  const [panelDivs, setPanelDivs] = useState([]);
  const [panelLabels, setPanelLabels] = useState([]);
  const [totalUsedArea, setTotalUsedArea] = useState("");
  const [totalWastedArea, setTotalWastedArea] = useState("");
  const [totalCuts, setTotalCuts] = useState("");
  const [inputValues, setInputValues] = useState({
    totalStockWidth: "",
    totalStockHeight: "",
  });

  function getColorForPanel(panelWidth, panelHeight) {
    const sizeString = `${panelWidth}x${panelHeight}`;

    const sizeToColorMap = new Map();
    if (!sizeToColorMap.has(sizeString)) {
      // Generate a random color for a new size and store it in the map
      const randomColor =
        "#" + Math.floor(Math.random() * 16777215).toString(16);
      sizeToColorMap.set(sizeString, randomColor);
    }
    return sizeToColorMap.get(sizeString);
  }
  const optimizeData = () => {
    console.log("jejkkejke");
    console.log({rows});
    let hasError = false;

    // Iterate through the rows
    for (const {id, height, width, quantity} of rows) {
      // Check if any input field is empty
      if (height === "" || width === "" || quantity === "") {
        hasError = true;
        break; // Exit the loop if an empty input is found
      }
    }

    if (hasError) {
      // Display an error alert (you can customize this as needed)
      alert("Please fill in all input fields before saving.");
    } else {
      var totalWastedArea = 0;
      var totalCuts = 0;
      var panelsPlaced = 0;
      var panelsTotal = 0;

      const stockLength = inputValues.totalStockHeight;
      const stockWidth = inputValues.totalStockWidth;

      // Sort the panels based on area (larger panels first)
      rows.sort((rowA, rowB) => {
        const areaA = parseInt(rowA.length) * parseInt(rowA.width);
        const areaB = parseInt(rowB.length) * parseInt(rowB.width);
        return areaB - areaA;
      });
      const stockSheet = document.getElementById("stockSheet");
      setStockSheetStyle({
        width: stockWidth + "px",
        height: stockLength + "px",
      });

      setStockWidth(stockWidth);

      const matrix = Array.from({length: stockLength + 1}, () =>
        Array(stockWidth + 1).fill(false)
      );
      console.log({matrix});
      let totalCutLength = 0;
      const parentPanel = [];
      const parentLabel = [];
      let totalWasteArea = stockLength * stockWidth;
      let totalUsedArea = 0;
      rows.forEach((panel) => {
        const panelWidth = parseInt(panel.width);
        const panelHeight = parseInt(panel.height);
        const panelQuantity = parseInt(panel.quantity);
        let panelDiv = {};
        let panelLabel = {};
        let bgColor = getColorForPanel(panelWidth, panelHeight);
        console.log({bgColor});
        console.log({panelHeight, panelWidth, panelQuantity, panel});
        for (let i = 0; i < panelQuantity; i++) {
          let placed = false;

          for (let row = 0; row <= stockLength - panelHeight; row++) {
            for (let col = 0; col <= stockWidth - panelWidth; col++) {
              let fits = true;

              for (let r = row; r < row + panelHeight; r++) {
                for (let c = col; c < col + panelWidth; c++) {
                  if (matrix[r][c]) {
                    fits = false;
                    break;
                  }
                }
                if (!fits) break;
              }

              if (fits) {
                for (let r = row; r < row + panelHeight; r++) {
                  for (let c = col; c < col + panelWidth; c++) {
                    matrix[r][c] = true;
                  }
                }
                panelDiv = {
                  id: parseInt(Math.random() * row),
                  className: "panel",
                  style: {
                    width: panelWidth + "px",
                    height: panelHeight + "px",
                    left: col + "px",
                    top: row + "px",
                    backgroundColor: bgColor,
                  },
                };
                panelLabel = {
                  id: parseInt(Math.random() * row),
                  className: "dimension-label",
                  style: {
                    width: panelWidth + "px",
                    height: panelHeight + "px",
                  },
                  width: panelWidth,
                  height: panelHeight,
                };
                let area = panelWidth * panelHeight;
                totalWasteArea -= area;
                totalUsedArea += area;
                parentPanel.push(panelDiv);
                parentLabel.push(panelLabel);
                placed = true;
                break;
              }
            }
            if (placed) break;
          }

          if (!placed) {
            alert("Insufficient stock space.");
            return;
          }
          totalCutLength += panelWidth + panelHeight;
        }

        panelsTotal += panelQuantity;
        console.log({panelQuantity, panelsTotal, panelsPlaced});
        // After placing all the panels, calculate the statistics
        totalCuts = panelsPlaced;
      });
      setPanelDivs(parentPanel);
      setPanelLabels(parentLabel);
      setUsedStockSheets(`${stockLength} ×${stockWidth} x${stockSheet}`);

      setTotalWastedArea(totalWasteArea);
      setTotalUsedArea(totalUsedArea);
      setTotalCuts(totalCuts);
      setTotalCutLength("6666");
      console.log({panelDivs, panelLabels});
      totalCutLength.toString();
      console.log({totalCutLength});
      console.log("wasted area= ", totalWastedArea);
    }
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

    // Update the state with the new row
    // Assuming you have a state setter function like setRows
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
    // Filter out the row with the specified id
    const updatedRows = rows.filter((row) => row.id !== id);

    // Update the state with the new array of rows
    // Assuming you have a state setter function like setRows
    setRows(updatedRows);
  };

  return (
    <div>
      <p>
        Sheet Width:{" "}
        <input
          value={inputValues.totalStockWidth}
          type="text"
          id="totalStockWidth"
          name="totalStockWidth"
          onChange={handleChange}
        />
      </p>
      <p>
        Sheet Width:{" "}
        <input
          value={inputValues.totalStockHeight}
          type="text"
          id="totalStockHeight"
          name="totalStockHeight"
          onChange={handleChange}
        />
      </p>
      <Table striped borderless hover variant="dark" size="sm" responsive>
        <thead>
          <tr>
            <th colSpan="5" className="text-capitalize">
              <img
                src={panelLogoIcon}
                alt=""
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
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
        <tbody>
          {rows.map(({height, width, quantity, result, id}, index) => {
            return (
              // <Row input={input} key={input.id}/>
              <tr>
                <td>
                  <input
                    type="number"
                    name="height"
                    value={height}
                    onChange={(e) => handleDataChange(e, id)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="width"
                    value={width}
                    onChange={(e) => handleDataChange(e, id)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => handleDataChange(e, id)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </td>
                {/* <td>{result}</td> */}
                <td>
                  <CustomButton
                    backgroundColor="red"
                    width="100px"
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </CustomButton>
                  {/* Add Delete button */}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <CustomButton backgroundColor="blue" width="150px" onClick={addRow}>
        Add Row
      </CustomButton>
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
      <div className="results panelContainer">
        <div id="stockSheet" className="stock-sheet" style={stockSheetStyle}>
          {/* Add dimension label with arrow for stock sheet */}
          <div className="dimension-label" style={{width: stockWidth + "px"}}>
            {stockWidth}
          </div>

          {panelDivs.map((panelDiv, index) => {
            const panelLabel = panelLabels[index];
            return (
              <div
                className="panelDiv panel"
                key={index}
                style={panelDiv.style}
              >
                <div
                  className="panelLabel"
                  key={panelLabel.id}
                  style={panelLabel.style}
                >
                  {panelLabel.width}{" "}
                  <span className="dimension-arrow">&rarr;</span>
                  {panelLabel.height}{" "}
                  <span className="dimension-arrow">&darr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Worksheet;
