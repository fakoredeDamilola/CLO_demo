import React, { useEffect, useRef, useState } from "react";
import Worksheet from "../components/Worksheet";
import Stocksheet from "../components/Stocksheet";
import { read, utils } from "xlsx";
import "../home.css";
import { displayPanelAndSheetInfo } from "../utils/functions";

const Home = () => {
  const [totalCutLength, setTotalCutLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [usedStockSheets, setUsedStockSheets] = useState("");
  const fileInputRef = useRef(null);
  const [rows, setRows] = useState([
    { id: 1, length: "", quantity: "", label: "djdjj", width: "", result: "" },
  ]);
  const [unit, setUnit] = useState("in");
  const [panelThickness, setPanelThickness] = useState("0");
  const [panelLabel, setPanelLabel] = useState(false);
  const [totalArea, setTotalArea] = useState("");
  const [percentTotalArea, setPercentTotalArea] = useState("");
  const [totalUsedArea, setTotalUsedArea] = useState("");
  const [totalUsedAreaPercentage, setTotalUsedAreaPercentage] = useState("");
  const [totalWastedArea, setTotalWastedArea] = useState("");
  const [totalWastedAreaPercentage, setTotalWastedAreaPercentage] =
    useState("");
  const [totalCuts, setTotalCuts] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    console.log(e.target);
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);

      if (
        selectedFile.name.endsWith(".xls") ||
        selectedFile.name.endsWith(".xlsx")
      ) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const binaryData = e.target.result;
          const workbook = read(binaryData, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const sheetData = utils.sheet_to_json(sheet, { header: 1 });
          console.log({ sheetData });
          // Assuming the first row contains headers
          const headers = sheetData[0];
          const parsedData = [];

          for (let i = 1; i < sheetData.length; i++) {
            const row = sheetData[i];
            const rowData = {};
            for (let j = 0; j < headers.length; j++) {
              rowData[headers[j]] = row[j];
            }
            parsedData.push(rowData);
          }

          const dataNeeded = parsedData.map((data) => ({
            length: data.length ?? "",
            quantity: data.quantity ?? "",
            label: data.label ?? "",
            width: data.width ?? "",
            id: parseInt(Math.random() * data.length),
            result: data.result ?? "",
          }));
          const newRows = rows
            .concat(dataNeeded)
            .filter((data) => data.length !== "");
          setRows(newRows);
          setSelectedFile(null);
        };
        reader.readAsBinaryString(selectedFile);
        setSelectedFile(null);
        fileInputRef.current.value = "";
      } else {
        console.error("Uploaded file is not an Excel file");
      }
    }
  };
  const [stockRows, setStockRows] = useState([
    { id: 1, length: "", quantity: "", width: "", label: "jhh", result: "" },
  ]);

  function optimizeData() {
    setLoading(true);
    const results = displayPanelAndSheetInfo(
      stockRows,
      rows,

      panelLabel,
      panelThickness <= 0 || panelThickness === "" ? 1 : panelThickness,
      unit
    );
    setTotalCutLength(results.totalCutLength);
    setUsedStockSheets(results.usedStockSheets);
    setTotalArea(results.totalArea);
    setPercentTotalArea(results.percentTotalArea);
    setTotalUsedArea(results.totalUsedArea);
    setTotalUsedAreaPercentage(results.totalUsedAreaPercentage);
    setTotalWastedArea(results.totalWastedArea);
    setTotalWastedAreaPercentage(results.totalWastedAreaPercentage);
    setTotalCuts(results.totalCuts);
    setLoading(false);
  }

  return (
    <div className="container">
      <h1>Panel and Sheet Information</h1>
      <div className="custom-upload-container">
        <input
          type="file"
          id="fileInput"
          ref={fileInputRef}
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
      <div className="row">
        <div className="col">
          <div style={{ margin: "50px 0" }}>
            <Stocksheet stockRows={stockRows} setStockRows={setStockRows} />
            <div style={{ margin: "50px 0" }}>
              <Worksheet rows={rows} setRows={setRows} />
            </div>
          </div>
        </div>
      </div>
      <br />

      <div className="row border bg-light pt-4">
        <div className="col-md-5">
          <div className="form-group">
            <label htmlFor="cutThickness">Cut / Blade / Kerf Thickness:</label>
            <input
              type="text"
              id="cutThickness"
              name="cutThickness"
              min="1"
              value="1"
              onChange={(e) => setPanelThickness(e.target.value)}
            />
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="panelLabels">Labels on Panels:</label>
            <label className="switch">
              <input type="checkbox" id="panelLabels" name="panelLabels" />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="col-md-4">
          <div className="form-group">
            <label htmlFor="singleSheet">Use Only One Sheet from Stock:</label>
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
      <br />
      <br />
      <br />
      <div className="container">
        <h2>Global Statistics</h2>
        <div className="row">
          <div className="col-md-4">
            <label htmlFor="totalUsedArea">
              Total Area of Used stock sheets:
            </label>
            <input
              type="text"
              className="form-control"
              id="totalArea"
              disabled
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              id="percentTotalArea"
              disabled
              value={percentTotalArea}
              onChange={(e) => setPercentTotalArea(e.target.value)}
            />
            <br />
          </div>
          <div className="col-md-4">
            <label htmlFor="totalUsedAreaPercentage">Total Used Area:</label>
            <input
              type="text"
              className="form-control"
              id="totalUsedArea"
              disabled
              value={totalUsedAreaPercentage}
              onChange={(e) => setTotalUsedAreaPercentage(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              id="totalUsedAreaPercentage"
              disabled
              value="0"
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="totalWastedArea">Total Wasted Area:</label>
            <input
              type="text"
              className="form-control"
              id="totalWastedArea"
              disabled
              value={totalWastedArea}
              onChange={(e) => setTotalWastedArea(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              id="totalWastedAreaPercentage"
              disabled
              value={totalWastedAreaPercentage}
              onChange={(e) => setTotalWastedAreaPercentage(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4">
            <label htmlFor="totalCuts">Total Cuts:</label>
            <input
              type="text"
              className="form-control"
              id="totalCuts"
              disabled
              value={totalCuts}
              onChange={(e) => setTotalCuts(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="totalCutLength">Total Cut Length:</label>
            <input
              type="text"
              className="form-control"
              id="totalCutLength"
              disabled
              value={totalCutLength}
              onChange={(e) => setTotalCutLength(e.target.value)}
            />
          </div>
        </div>
      </div>
      <br />
      <br />

      <div className="row">
        <div className="col">
          <h2>Drawing / Visualization:</h2>
          <div>
            <div id="labels">
              <h6>Dimension (L x W)</h6>
              <p>
                &darr;
                <span
                  id="totalSheetLength"
                  style={{ color: "red" }}
                ></span>{" "}
                &rarr;
                <span id="totalWidthLabel" style={{ color: "red" }}></span>
              </p>
            </div>
            <div id="svgContainer">SVG will be appended here</div>

            <p id="ede"></p>
            <canvas
              id="outerCanvas"
              style={{ borderColor: "black" }}
              width="100"
              height="100"
            ></canvas>

            <canvas
              id="sheetPanelCanvas"
              style={{ position: "absolute", top: 0, left: 0 }}
            ></canvas>

            <p></p>
          </div>
          <br />
          <div className="container">
            <div id="result" className="sheets">
              Sheets representation will be displayed here
            </div>
          </div>
          <div className="container">
            <div id="drawingArea" className="sheets">
              Sheets representation will be displayed here
            </div>
          </div>
        </div>
        <br />
      </div>
    </div>
  );
};

export default Home;
