import React, {useState} from "react";
import Worksheet from "../components/Worksheet";
import Stocksheet from "../components/Stocksheet";
import Results from "../components/Results";
import InputRows from "../components/InputRows";
import Options from "../components/Options";
import {read, utils} from "xlsx";
// import {v4 as uuidv4} from "uuid";

const Home = () => {
  const [panelDivs, setPanelDivs] = useState([]);
  const [panelLabels, setPanelLabels] = useState([]);
  const [stockWidth, setStockWidth] = useState(0);
  const [totalCutLength, setTotalCutLength] = useState(0);
  const [usedStockSheets, setUsedStockSheets] = useState("");
  const [rows, setRows] = useState([
    {id: 1, height: "", quantity: "", label: "", width: "", result: ""},
  ]);
  const [remainingPanel, setRemainingPanel] = useState([]);
  const [panelThickness, setPanelThickness] = useState("");
  const [panelLabel, setPanelLabel] = useState(true);
  const [totalUsedArea, setTotalUsedArea] = useState("");
  const [totalWastedArea, setTotalWastedArea] = useState("");
  const [totalCuts, setTotalCuts] = useState("");
  const [inputValues, setInputValues] = useState({
    totalStockWidth: "",
    totalStockHeight: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Function to handle file upload (you can send it to a server here)
  const handleUpload = () => {
    if (selectedFile) {
      // Here, you can send the file to a server or perform other actions
      console.log("Uploading file:", selectedFile);

      // Check if the uploaded selectedFile has an Excel extension
      if (
        selectedFile.name.endsWith(".xls") ||
        selectedFile.name.endsWith(".xlsx")
      ) {
        console.log("28838");
        const reader = new FileReader();
        reader.onload = (e) => {
          const binaryData = e.target.result;
          const workbook = read(binaryData, {type: "binary"});
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const sheetData = utils.sheet_to_json(sheet, {header: 1});

          // Assuming the first row contains headers
          const headers = sheetData[0];
          const parsedData = [];

          // Iterate through rows and create objects with key-value pairs
          for (let i = 1; i < sheetData.length; i++) {
            const row = sheetData[i];
            const rowData = {};
            for (let j = 0; j < headers.length; j++) {
              rowData[headers[j]] = row[j];
            }
            parsedData.push(rowData);
          }

          // Set the parsed data in state
          // setData(parsedData);
          console.log({parsedData});
          const dataNeeded = parsedData.map((data) => ({
            height: data.height ?? "",
            quantity: data.quantity ?? "",
            label: data.label ?? "",
            width: data.width ?? "",
            id: parseInt(Math.random() * data.height),
            result: data.result ?? "",
          }));
          setRows((prevData) => [...prevData, ...dataNeeded]);
          setSelectedFile(null);
        };
        reader.readAsBinaryString(selectedFile);
      } else {
        // Handle the case where the file is not an Excel file
        console.error("Uploaded file is not an Excel file");
        // setData([]); // Clear any previously parsed data
      }
    }
  };

  const [stockSheetStyle, setStockSheetStyle] = useState({
    width: "0",
    height: "0",
  });
  const [stockRows, setStockRows] = useState([
    {id: 1, height: "", quantity: "", width: "", label: "", result: ""},
  ]);

  function getColorForPanel(panelWidth, panelHeight) {
    const sizeString = `${panelWidth}x${panelHeight}`;

    const sizeToColorMap = new Map();
    if (!sizeToColorMap.has(sizeString)) {
      // Generate a random color for a new size and store it in the map
      const randomColor =
        "#" + Math.floor(Math.random() * 16777215).toString(16) + "13";
      sizeToColorMap.set(sizeString, randomColor);
    }
    return sizeToColorMap.get(sizeString);
  }
  const optimizeData = () => {
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
      var totalCuts = 0;
      var panelsPlaced = 0;
      var panelsTotal = 0;
      var currentStockSheet = 0;
      const stockLength = inputValues.totalStockHeight;
      const stockWidth = inputValues.totalStockWidth;

      rows.sort((rowA, rowB) => {
        const areaA = parseInt(rowA.length) * parseInt(rowA.width);
        const areaB = parseInt(rowB.length) * parseInt(rowB.width);
        return areaB - areaA;
      });
      setStockSheetStyle({
        width: stockWidth + "px",
        height: stockLength + "px",
      });

      setStockWidth(stockWidth);

      function optimizePanels(
        stockLength,
        stockWidth,
        rows,
        panelMargin = "0"
      ) {
        const results = [];
        let totalCutLength = 0;
        let totalUsedArea = 0;
        const parentPanel = [];
        const parentLabel = [];
        setRemainingPanel(rows);

        stockLength = parseInt(stockLength);
        stockWidth = parseInt(stockWidth);

        const matrix = Array.from({length: stockLength + 1}, () =>
          Array(stockWidth + 1).fill(false)
        );

        rows.sort((a, b) => b.width * b.height - a.width * a.height);

        function canFit(row, col, panelWidth, panelHeight) {
          for (let r = row; r < row + panelHeight; r++) {
            for (let c = col; c < col + panelWidth; c++) {
              if (matrix[r][c]) {
                return false;
              }
            }
          }
          return true;
        }
        function placePanel(row, col, panelWidth, panelHeight, panelText) {
          for (let r = row; r < row + panelHeight; r++) {
            for (let c = col; c < col + panelWidth; c++) {
              matrix[r][c] = true;
            }
          }

          const panelDiv = {
            id: parseInt(Math.random() * row),
            className: "panel",
            style: {
              width: panelWidth + "px",
              height: panelHeight + "px",
              left: col + "px",
              top: row + "px",
              backgroundColor: getColorForPanel(panelWidth, panelHeight),
            },
          };

          const panelLabel = {
            id: parseInt(Math.random() * row),
            className: "dimension-label",
            style: {
              width: panelWidth + "px",
              height: panelHeight + "px",
              left: col + panelMargin * 2 + "px",
              top: row + "px",
            },
            panelText,
            width: panelWidth,
            height: panelHeight,
          };

          const area = panelWidth * panelHeight;
          totalUsedArea += area;
          parentPanel.push(panelDiv);
          parentLabel.push(panelLabel);
          totalCutLength += panelWidth + panelHeight + panelMargin * 2; // Account for panel thickness
        }

        for (const panel of rows) {
          const panelWidth = parseInt(panel.width);
          const panelHeight = parseInt(panel.height);
          const panelQuantity = parseInt(panel.quantity);
          const panelText = panel.label;

          for (let i = 0; i < panelQuantity; i++) {
            let placed = false;

            for (let row = 0; row <= stockLength - panelHeight; row++) {
              for (let col = 0; col <= stockWidth - panelWidth; col++) {
                if (canFit(row, col, panelWidth, panelHeight)) {
                  placePanel(row, col, panelWidth, panelHeight, panelText);
                  placed = true;
                  break;
                }
              }
              if (placed) break;
            }

            if (!placed) {
              setRemainingPanel([...remainingPanel, panel]);
              break;
            }
          }
        }
        const totalWasteArea = stockLength * stockWidth - totalUsedArea;
        const panelsTotal = rows.reduce(
          (acc, panel) => acc + parseInt(panel.quantity),
          0
        );

        results.push({
          parentPanel,
          parentLabel,
          totalCutLength,
          totalWasteArea,
          panelsTotal,
        });
        return results;
      }

      const result = optimizePanels(1000, 1000, rows, panelThickness);
      console.log(result);
      setPanelDivs(result[0].parentPanel);
      setPanelLabels(result[0].parentLabel);
      setTotalCutLength(result[0].totalCutLength);
      setTotalWastedArea(result[0].totalWasteArea);
    }
  };

  return (
    <div className="container">
      <Stocksheet
        setStockRows={setStockRows}
        stockRows={stockRows}
        panelLabel={panelLabel}
      />

      <Worksheet
        rows={rows}
        panelLabel={panelLabel}
        setRows={setRows}
        optimizeData={optimizeData}
        inputValues={inputValues}
        setInputValues={setInputValues}
      />
      <div className="custom-upload-container">
        <input
          type="file"
          id="fileInput"
          style={{display: "none"}}
          accept=".xlsx, .xls"
          onChange={handleFileChange}
        />
        <label htmlFor="fileInput" className="custom-upload-button">
          {selectedFile
            ? `Selected File: ${selectedFile.name}`
            : "Choose an Excel file"}
        </label>
        {selectedFile && (
          <button onClick={handleUpload} className="custom-upload-button">
            Upload
          </button>
        )}
      </div>
      <div>
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
          <input
            type="text"
            value={totalUsedArea}
            id="totalUsedArea"
            readonly
          />
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
      <Options
        panelLabel={panelLabel}
        setPanelLabel={setPanelLabel}
        panelThickness={panelThickness}
        setPanelThickness={setPanelThickness}
      />
      {/*  */}
      {/* <PlacementDetails placementDetails={placementDetails} /> */}
      <Results
        panelDivs={panelDivs}
        panelLabels={panelLabels}
        stockSheetStyle={stockSheetStyle}
        stockWidth={stockWidth}
        panelText={panelLabel}
      />
    </div>
  );
};

export default Home;
