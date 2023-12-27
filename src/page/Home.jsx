import React, { useState } from "react";
import Worksheet from "../components/Worksheet";
import Stocksheet from "../components/Stocksheet";
import Results from "../components/Results";
import Options from "../components/Options";
import { read, utils } from "xlsx";
import { optimizePanels } from "../utils/functions";
// import {v4 as uuidv4} from "uuid";

const Home = () => {
  const [panelDivs, setPanelDivs] = useState([]);
  const [panelLabels, setPanelLabels] = useState([]);
  const [stockWidth, setStockWidth] = useState(0);
  const [totalCutLength, setTotalCutLength] = useState(0);
  const [usedStockSheets, setUsedStockSheets] = useState("");
  const [rows, setRows] = useState([
    { id: 1, height: "", quantity: "", label: "", width: "", result: "" },
  ]);
  const [remainingPanel, setRemainingPanel] = useState([]);
  const [panelThickness, setPanelThickness] = useState("0");
  const [panelLabel, setPanelLabel] = useState(true);
  const [totalUsedArea, setTotalUsedArea] = useState("");
  const [totalWastedArea, setTotalWastedArea] = useState("");
  const [totalCuts, setTotalCuts] = useState("");
  const [inputValues, setInputValues] = useState({
    totalStockWidth: "",
    totalStockHeight: "",
  });
  const [results, setResults] = useState({ parentPanels: [] });
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
          const workbook = read(binaryData, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const sheetData = utils.sheet_to_json(sheet, { header: 1 });

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
          console.log({ parsedData });
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
    { id: 1, height: "", quantity: "", width: "", label: "", result: "" },
  ]);

  function optimizeData() {
    const propertyObject = optimizePanels(rows, stockRows);
    console.log({ propertyObject });
  }

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
        inputValues={inputValues}
        setInputValues={setInputValues}
      />
      <div className="custom-upload-container">
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
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
      <div className="row border bg-light pt-4">
        <div className="col-md-5">
          <div className="form-group">
            <label for="cutThickness">Cut / Blade / Kerf Thickness:</label>
            <input
              type="text"
              id="cutThickness"
              name="cutThickness"
              min="1"
              value="1"
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group">
            <label for="panelLabels">Labels on Panels:</label>
            <label className="switch">
              <input type="checkbox" id="panelLabels" name="panelLabels" />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label for="singleSheet">Use Only One Sheet from Stock:</label>
            <label className="switch">
              <input type="checkbox" id="singleSheet" name="singleSheet" />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
      <br />
      <button
        className="btn btn-primary mt-2 col-md-12"
        id="showInfo"
        onClick={optimizeData}
      >
        Calculate
      </button>
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
      {/* {results.map((result, index) => {
        return (
          <div>
            all sheets */}
      {/* {results.parentLabel && (
        <Results
          panelDivs={results.parentPanel}
          panelLabels={results.parentLabel}
          stockSheetStyle={results.stockSheetStyle}
          stockWidth="1000"
          panelText={results.panelText}
        />
      )} */}
      {/* {results.parentPanels &&
        results.parentPanels.map((result) => {
          console.log({ result });
          return (
            <Results
              panelDivs={result.parentPanel}
              panelLabels={result.parentLabel}
              stockSheetStyle={"red"}
              stockWidth="1000"
              panelText={"blue"}
            />
          );
        })} */}
      <div className="col">
        <h2>Drawing / Visualization:</h2>
        <div>
          <div id="labels">
            <h6>Dimension (L x W)</h6>
          </div>
          <div id="svgContainer"></div>

          <p id="ede"></p>

          <p></p>
        </div>
        <br />
        <div className="container">
          <div id="result" className="sheets"></div>
        </div>
        <div className="container">
          <div id="drawingArea" className="sheets"></div>
        </div>
      </div>
      <canvas
        id="outerCanvas"
        style={{ borderColor: "black" }}
        width="100"
        height="100"
      ></canvas>
    </div>
  );
};

export default Home;
