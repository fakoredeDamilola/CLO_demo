import React, { useEffect, useRef, useState } from "react";
import Worksheet from "../components/Worksheet";
import Stocksheet from "../components/Stocksheet";
import { read, utils } from "xlsx";
import "../home.css";
import { displayPanelAndSheetInfo } from "../utils/functions";
import CollapsibleTable from "../components/CollapsibleTable";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
import SheetTable from "../components/SheetTable";

const Home = () => {
  const unitOptions = [
    { value: "", label: "Select a Unit" },
    { value: "in", label: "Inches" },
    { value: "cm", label: "Centimeters" },
    { value: "mm", label: "Millimeters" },
  ];
  const [totalCutLength, setTotalCutLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [usedStockSheets, setUsedStockSheets] = useState("");
  const [rows, setRows] = useState([
    {
      id: 1,
      length: "100",
      quantity: "100",
      label: "djdjj",
      width: "100",
      result: "50",
    },
  ]);
  const [stockRows, setStockRows] = useState([
    {
      id: 1,
      length: "1000",
      quantity: "1",
      width: "1000",
      label: "",
      result: "",
    },
  ]);
  const [unit, setUnit] = useState("in");
  const [optimizationCompleted, setOptimizationCompleted] = useState(false);
  const [sheetDetails, setSheetDetails] = useState([]);
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
  const [globalStatistics, setGlobalStatistics] = useState([]);

  const [selectedPanelFile, setSelectedPanelFile] = useState(null);
  const [selectedSheetFile, setSelectedSheetFile] = useState(null);

  const handleChange = (e, type) => {
    console.log(e.target, type, e.target.name);
    const file = e.target.files[0];
    if (type === "panels") {
      setSelectedPanelFile(file);
    } else {
      setSelectedSheetFile(file);
    }
  };

  const handleUpload = (id) => {
    const selectedFile =
      id === "panels" ? selectedPanelFile : selectedSheetFile;
    const dataRows = id === "panels" ? rows : stockRows;
    console.log({ dataRows, id });
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
          const newRows = dataRows
            .concat(dataNeeded)
            .filter((data) => data.length !== "");
          if (id === "sheets") {
            setStockRows(newRows);
          } else {
            setRows(newRows);
          }

          setSelectedPanelFile(null);
          setSelectedSheetFile(null);
        };
        reader.readAsBinaryString(selectedFile);
        setSelectedPanelFile(null);
        setSelectedSheetFile(null);
      } else {
        console.error("Uploaded file is not an Excel file");
      }
    }
  };

  const handleUnitInput = (event) => {
    setUnit(event.target.value);
  };

  function optimizeData() {
    setLoading(true);
    setOptimizationCompleted(false);
    const response = displayPanelAndSheetInfo(
      stockRows,
      rows,
      panelLabel,
      parseInt(panelThickness) <= 0 || panelThickness === ""
        ? 1
        : parseInt(panelThickness),
      unit
    );
    const { totalData: results, getGlobalSheetStatistics } = response;
    setGlobalStatistics(getGlobalSheetStatistics);
    setOptimizationCompleted(true);
    setTotalCutLength(results.totalCutLength);
    setUsedStockSheets(results.usedStockSheets);
    setTotalArea(results.totalArea);
    setPercentTotalArea(results.percentTotalArea);
    setTotalUsedArea(results.totalAreaUsed);
    setTotalUsedAreaPercentage(results.totalUsedAreaPercentage);
    setTotalWastedArea(results.totalWastedArea);
    setTotalWastedAreaPercentage(results.totalWastedAreaPercentage);
    setTotalCuts(results.totalCuts);
    setSheetDetails(results.sheetDetails);
    setPanelThickness(results.panelThickness);
    setLoading(false);
  }

  return (
    <div>
      <Header optimizeData={optimizeData} />

      {loading ? (
        <Spinner />
      ) : (
        <div className={`container app ${loading ? "blur" : ""}`}>
          <h1>Panel and Sheet Information</h1>

          <div className="row">
            <div className="col">
              <div style={{ margin: "50px 0" }}>
                <Stocksheet
                  stockRows={stockRows}
                  setStockRows={setStockRows}
                  panelLabel={panelLabel}
                  handleFileChange={(e) => handleChange(e, "sheets")}
                  selectedFile={selectedSheetFile}
                  handleUpload={() => handleUpload("sheets")}
                />
                <div style={{ margin: "50px 0" }}>
                  <Worksheet
                    rows={rows}
                    setRows={setRows}
                    panelLabel={panelLabel}
                    handleFileChange={(e) => handleChange(e, "panels")}
                    selectedFile={selectedPanelFile}
                    handleUpload={() => handleUpload("panels")}
                  />
                </div>
              </div>
            </div>
          </div>
          <br />

          <div className="row border bg-light pt-4">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="cutThickness">
                  Cut / Blade / Kerf Thickness:
                </label>
                <div>
                  <input
                    type="text"
                    id="cutThickness"
                    name="cutThickness"
                    value={panelThickness}
                    onChange={(e) => setPanelThickness(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="exampleSelect">Select Unit</label>
                <select
                  className="form-control"
                  id="exampleSelect"
                  value={unit}
                  onChange={handleUnitInput}
                >
                  {unitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="row border bg-light pt-4">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="panelLabels">Labels on Panels:</label>
                <label className="switch">
                  <input
                    type="checkbox"
                    id="panelLabels"
                    name="panelLabels"
                    onChange={(e) => setPanelLabel(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="singleSheet">
                  Use Only One Sheet from Stock:
                </label>
                <label className="switch">
                  <input type="checkbox" id="singleSheet" name="singleSheet" />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="my-5">
            <div>
              <h2>Drawing / Visualization:</h2>
              <div>
                <div id="labels">
                  <h6>Dimension (L x W)</h6>
                </div>
                <div id="svgContainer">SVG will be appended here</div>

                <canvas
                  id="outerCanvas"
                  style={{ borderColor: "black" }}
                  width="100"
                  height="100"
                ></canvas>
              </div>
              {optimizationCompleted && (
                <div>
                  <div className="container">
                    <div id="result" className="sheets">
                      Sheets representation will be displayed here
                    </div>
                  </div>
                  <div className="mb-5">
                    <CollapsibleTable
                      totalUsedArea={totalUsedArea}
                      totalUsedAreaPercentage={totalUsedAreaPercentage}
                      totalCutLength={totalCutLength}
                      totalCuts={totalCuts}
                      sheetDetails={sheetDetails}
                      totalWastedArea={totalWastedArea}
                      totalWastedAreaPercentage={totalWastedAreaPercentage}
                      panelThickness={panelThickness}
                    />
                  </div>
                  <div className="mb-5">
                    <SheetTable globalStatistics={globalStatistics} />
                  </div>
                </div>
              )}
            </div>
            <br />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
