import React, { useState } from "react";
import Worksheet from "../components/Worksheet";
import Stocksheet from "../components/Stocksheet";
import Results from "../components/Results";
import Options from "../components/Options";
import { read, utils } from "xlsx";
import { optimizePanels } from "../utils/functions";
// import {v4 as uuidv4} from "uuid";

const Home = () => {
  const [usedStockSheets, setUsedStockSheets] = useState("");
  const [rows, setRows] = useState([
    { id: 1, height: "", quantity: "", label: "", width: "", result: "" },
  ]);
  const [panelThickness, setPanelThickness] = useState("0");
  const [panelLabel, setPanelLabel] = useState(true);
  const [totalUsedArea, setTotalUsedArea] = useState("");
  const [totalCuts, setTotalCuts] = useState("");

  const [results, setResults] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
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
        console.log("28838");
        const reader = new FileReader();
        reader.onload = (e) => {
          const binaryData = e.target.result;
          const workbook = read(binaryData, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const sheetData = utils.sheet_to_json(sheet, { header: 1 });

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
        console.error("Uploaded file is not an Excel file");
      }
    }
  };

  const [stockRows, setStockRows] = useState([
    { id: 1, height: "", quantity: "", width: "", label: "", result: "" },
  ]);

  const optimizeData = () => {
    console.log(12);
    let hasError = false;
    for (const { id, height, width, quantity } of rows) {
      if (height === "" || width === "" || quantity === "") {
        hasError = true;
        break;
      }
    }

    if (hasError) {
      alert("Please fill in all input fields before saving.");
    } else {
      rows.sort((rowA, rowB) => {
        const areaA = parseInt(rowA.length) * parseInt(rowA.width);
        const areaB = parseInt(rowB.length) * parseInt(rowB.width);
        return areaB - areaA;
      });

      const newRows = stockRows.map((row) => {
        return {
          width: row.width,
          height: row.height,
          quantity: parseInt(row.quantity),
        };
      });
      console.log({ newRows });
      // const result = optimizePanels(
      //   [{ width: stockWidth, height: stockLength, quantity: 3 }],
      //   rows,
      //   panelThickness === "" ? 0 : panelThickness
      // );
      const result = optimizePanels(
        newRows,
        rows,
        panelThickness === "" ? 0 : panelThickness
      );
      console.log(result, result[0].totalWasteArea);

      setResults(result);
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
      <Options
        panelLabel={panelLabel}
        setPanelLabel={setPanelLabel}
        panelThickness={panelThickness}
        setPanelThickness={setPanelThickness}
      />

      <h3 style={{ margin: "20px 0" }}>RESULTS</h3>
      {results.map((result, index) => {
        const resData = result[0];
        return (
          <div>
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

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  margin: "15px 0",
                }}
              >
                <div>Total Wasted Area</div>
                <div
                  style={{
                    width: "100px",
                    height: "40px",
                    borderRadius: "5px",
                    backgroundColor: "red",
                    color: "white",
                    padding: "10px",
                    boxSizing: "border-box",
                  }}
                >
                  {resData.totalWasteArea}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  margin: "15px 0",
                }}
              >
                <div>Total Cut Length</div>
                <div
                  style={{
                    width: "100px",
                    height: "40px",
                    borderRadius: "5px",
                    backgroundColor: "red",
                    color: "white",
                    padding: "10px",
                    boxSizing: "border-box",
                  }}
                >
                  {resData.totalCutLength}
                </div>
              </div>

              <p>
                Total cuts:{" "}
                <input value={totalCuts} type="text" id="totalCuts" readonly />
              </p>
            </div>
            <Results
              key={index}
              panelDivs={resData.parentPanel}
              panelLabels={resData.parentLabel}
              stockSheetStyle={resData.stockSheetStyle}
              stockWidth="1000"
              panelText={resData.panelText}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Home;
