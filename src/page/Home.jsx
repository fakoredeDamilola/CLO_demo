import React, { useEffect, useRef, useState } from "react";
import Panelsheet from "../components/Panelsheet";
import Stocksheet from "../components/Stocksheet";
import { read, utils } from "xlsx";
import "../home.css";
import {
  checkForErrors,
  checkForErrorInExcelFile,
  displayPanelAndSheetInfo,
} from "../utils/functions";
import GlobalSheetTable from "../components/GlobalSheetTable";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
import SheetTable from "../components/SheetTable";
import ErrorModal from "../components/ErrorModal";
import NotPlacedPanelTable from "../components/NotPlacedPanelTable";
import { useDispatch } from "react-redux";
import { addMaterial } from "../store/Material.slice";
import MetalWeightCalculator from "../components/MetalWeightCalculator";
import GeneratePDF from "../components/GeneratePDF";
import PDFSettingModal from "../components/modal/PDFSettingModal";
import {
  autoGenerateName,
  getUniqueId,
  handleCheckFields,
} from "../utils/func";

const Home = () => {
  const unitOptions = [
    { value: "", label: "Select a Unit" },
    { value: "in", label: "Inches" },
    { value: "cm", label: "Centimeters" },
    { value: "mm", label: "Millimeters" },
  ];

  const [loading, setLoading] = useState(false);
  const [usedStockSheets, setUsedStockSheets] = useState("");
  const [uploadFileSpinner, setUploadFileSpinner] = useState(false);
  const [panelRows, setPanelRows] = useState([
    {
      id: 1,
      length: "100",
      quantity: "1",
      label: "",
      width: "50",
      material: "",
      result: "50",
      grainDirection: "horizontal",
      selected: true,
    },
    {
      id: 2,
      length: "100",
      quantity: "100",
      label: "",
      width: "130",
      material: "",
      result: "50",
      grainDirection: "horizontal",
      selected: true,
    },
    {
      id: 3,
      length: "250",
      quantity: "50",
      label: "",
      width: "70",
      material: "",
      result: "50",
      grainDirection: "horizontal",
      selected: true,
    },
  ]);
  const [stockSheetRows, setStockSheetRows] = useState([
    {
      id: 1,
      length: "700",
      quantity: "2",
      width: "500",
      label: "",
      material: "",
      result: "",
      selected: true,
      grainDirection: "horizontal",
    },
    {
      id: 2,
      length: "300",
      quantity: "1",
      width: "400",
      label: "",
      material: "",
      result: "",
      selected: true,
      grainDirection: "horizontal",
    },
    {
      id: 3,
      length: "700",
      quantity: "1",
      width: "500",
      label: "",
      material: "",
      result: "",
      selected: true,
      grainDirection: "horizontal",
    },
    {
      id: 4,
      length: "800",
      quantity: "2",
      width: "600",
      label: "",
      material: "",
      result: "",
      selected: true,
      grainDirection: "horizontal",
    },
  ]);
  const [unit, setUnit] = useState("in");
  const [optimizationCompleted, setOptimizationCompleted] = useState(false);
  const [panelThickness, setPanelThickness] = useState("0");
  const [errors, setErrors] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [changeIntialUnit, setChangeIntialUnit] = useState(false);
  const [sheetStatistics, setSheetStatistics] = useState([]);
  const [resultReady, setResultReady] = useState(false);
  const [selectedPanelFile, setSelectedPanelFile] = useState(null);
  const [selectedSheetFile, setSelectedSheetFile] = useState(null);
  const [additionalFeatures, setAdditionalFeatures] = useState({
    considerGrainDirection: false,
    addMaterialToSheets: false,
    panelLabel: false,
  });
  const [svgString, setSvgString] = useState("");
  const [svgSheetArray, setSvgSheetArray] = useState([]);
  const [globalSheetStatistics, setGlobalSheetStatistics] = useState({});
  const [notPlacePanels, setNotPlacePanels] = useState([]);
  const [pdfFileName, setPdfFileName] = useState("");
  const [pdfHeaderText, setPdfHeaderText] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [generatePDFData, setGeneratePDFData] = useState(false);
  const [parsedDataFromFile, setParsedDataFromFile] = useState([]);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { considerGrainDirection, addMaterialToSheets, panelLabel } =
    additionalFeatures;

  useEffect(() => {
    setChangeIntialUnit(false);
  }, []);

  useEffect(() => {
    if (stockSheetRows.length > 0 || panelRows.length > 0) {
      parsedDataFromFile.forEach((item) => {
        dispatch(addMaterial(item.material));
      });
    }
  }, [stockSheetRows, panelRows]);

  const parseTableData = (tableData, type) => {
    const rows = tableData.trim().split("\n");
    const headers = rows[0].split(/\s+/); // Split headers based on spaces
    const data = rows.slice(1).map((row) => {
      const values = row.split(/\s+/); // Split row data by spaces
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = values[index] || null; // Mapping values to headers
      });
      return obj;
    });
    const dataForTable = handleCheckFields(data);

    if (type === "sheets") {
      setStockSheetRows({ ...stockSheetRows, ...dataForTable });
    } else {
      setPanelRows({ ...panelRows, ...dataForTable });
    }
  };

  const handleChange = (e, type) => {
    const file = e.target.files[0];
    if (type === "panels") {
      setSelectedPanelFile(file);
    } else {
      setSelectedSheetFile(file);
    }
  };

  const handleUpload = (id) => {
    try {
      setUploadFileSpinner(true);
      const selectedFile =
        id === "panels" ? selectedPanelFile : selectedSheetFile;
      const dataRows = id === "panels" ? panelRows : stockSheetRows;
      console.log({ id, selectedFile });

      if (selectedFile) {
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

            const headers = sheetData[0];
            const parsedData = [];

            for (let i = 1; i < sheetData.length; i++) {
              const row = sheetData[i];

              const isRowEmpty = row.every((cell) => !cell);

              if (isRowEmpty) {
                break;
              }

              const rowData = {};
              for (let j = 0; j < headers.length; j++) {
                rowData[headers[j]] = row[j];
              }

              parsedData.push(rowData);
            }
            const errors = checkForErrorInExcelFile(parsedData);
            console.log({ errors });
            if (errors.length > 0) {
              setErrors(errors);
              setShowErrorModal(true);
              return;
            } else {
              const dataNeeded = parsedData.map((data) => ({
                id: getUniqueId(),
                length: data.length ? `${data.length}` : "",
                quantity: data.quantity ? `${data.quantity}` : "",
                label: data.label ?? "",
                width: data.width ? `${data.width}` : "",
                material: data.material ?? "",
                grainDirection: data.grainDirection ?? "horizontal",
                selected: true,
                result: data.result ? `${data.result}` : "",
              }));
              const newRows = [...dataRows, ...dataNeeded];
              setParsedDataFromFile(dataNeeded);
              if (id === "sheets") {
                setStockSheetRows(newRows);
              } else {
                setPanelRows(newRows);
              }

              setUploadFileSpinner(false);
              setParsedDataFromFile([]);
              setSelectedPanelFile(null);
              setSelectedSheetFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = ""; // This clears the file input element
              }
            }
          };
          reader.readAsBinaryString(selectedFile);
        } else {
          console.error("Uploaded file is not an Excel file");
        }
      }
    } catch (e) {
      console.log({ e });
    }
  };

  const handleUnitInput = (event) => {
    setUnit(event.target.value);
  };

  const handleCloseModal = (cont = false) => {
    setShowErrorModal(false);
    if (cont) {
      optimizeDataAndResult();
    }
  };

  function optimizeData() {
    setOptimizationCompleted(false);

    const errors = checkForErrors(stockSheetRows, panelRows, panelLabel);
    setErrors(errors);
    if (errors.length === 0) {
      setLoading(true);
      optimizeDataAndResult();
    } else {
      setShowErrorModal(true);
    }
  }

  const filterUnusedData = (data) => {
    return data.filter((data) => data.selected);
  };

  const openPDFOptionSettings = () => {
    const PDFFileName = autoGenerateName("Alunex Optimizer");
    setPdfFileName(PDFFileName);
    setPdfHeaderText("Alunex Optimizer");
    setShowPdfModal(true);
  };

  const optimizeDataAndResult = () => {
    setResultReady(false);
    const filteredStockSheet = filterUnusedData(stockSheetRows);
    const filteredPanelSheet = filterUnusedData(panelRows);

    const response = displayPanelAndSheetInfo(
      filteredStockSheet,
      filteredPanelSheet,
      additionalFeatures,
      parseInt(panelThickness) <= -1 || panelThickness === ""
        ? 0
        : parseInt(panelThickness),
      unit
    );
    const {
      totalData: results,
      sheetStatistics,
      globalSheetStatistics,
      notPlacedPanelArray,
      svgString,
      svgSheetArray,
    } = response;
    console.log({ panelRows });
    setSheetStatistics(sheetStatistics);
    setOptimizationCompleted(true);
    setGlobalSheetStatistics(globalSheetStatistics);
    setSvgSheetArray(svgSheetArray);
    setNotPlacePanels(notPlacedPanelArray);
    setUsedStockSheets(results.usedStockSheets);
    setPanelThickness(results.panelThickness);
    setSvgString(svgString);
    console.log({ results });
    setLoading(false);
    setResultReady(true);
  };

  const handlePaste = (e) => {
    // Prevent the default paste behavior
    e.preventDefault();

    // Get the pasted content as text
    const pastedData = e.clipboardData.getData("text");
    console.log("Pasted content:", pastedData);

    // Set the pasted text to the state
    setPastedText(pastedData);
  };

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
                  stockSheetRows={stockSheetRows}
                  setStockSheetRows={setStockSheetRows}
                  panelLabel={panelLabel}
                  handleFileChange={(e) => handleChange(e, "sheets")}
                  selectedFile={selectedSheetFile}
                  setChangeIntialUnit={setChangeIntialUnit}
                  handleUpload={() => handleUpload("sheets")}
                  addMaterialToSheets={addMaterialToSheets}
                  onPaste={handlePaste}
                  fileInputRef={fileInputRef}
                  parseTableData={(data) => parseTableData(data, "sheets")}
                  uploadFileSpinner={uploadFileSpinner}
                  setUploadFileSpinner={setUploadFileSpinner}
                  considerGrainDirection={considerGrainDirection}
                />

                <div style={{ margin: "50px 0" }}>
                  <Panelsheet
                    panelRows={panelRows}
                    setPanelRows={setPanelRows}
                    panelLabel={panelLabel}
                    setChangeIntialUnit={setChangeIntialUnit}
                    handleFileChange={(e) => handleChange(e, "panels")}
                    selectedFile={selectedPanelFile}
                    handleUpload={() => handleUpload("panels")}
                    addMaterialToSheets={addMaterialToSheets}
                    onPaste={handlePaste}
                    fileInputRef={fileInputRef}
                    uploadFileSpinner={uploadFileSpinner}
                    setUploadFileSpinner={setUploadFileSpinner}
                    parseTableData={(data) => parseTableData(data, "panels")}
                    considerGrainDirection={considerGrainDirection}
                  />
                </div>
              </div>
            </div>
          </div>
          <br />

          <div className="row border bg-light pt-4">
            <div className="col-md-4">
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
            <div className="col-md-4">
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
            <div className="col-md-4">
              <div
                className="form-group"
                style={{ display: "flex", marginTop: "30px" }}
              >
                <label
                  htmlFor="grainDirection"
                  style={{
                    display: "block",
                    marginRight: "10px",
                    marginTop: "5px",
                  }}
                >
                  Consider Grain Direction:
                </label>
                <label className="switch">
                  <input
                    type="checkbox"
                    id="grainDirection"
                    name="grainDirection"
                    onChange={(e) =>
                      setAdditionalFeatures((prev) => ({
                        ...prev,
                        considerGrainDirection: e.target.checked,
                      }))
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="row border bg-light pt-4">
            <div className="col-md-4">
              <div className="form-group" style={{ display: "flex" }}>
                <label
                  htmlFor="addMaterialToSheets"
                  style={{
                    display: "block",
                    marginRight: "10px",
                    marginTop: "5px",
                  }}
                >
                  Consider Material:
                </label>
                <label className="switch">
                  <input
                    type="checkbox"
                    id="addMaterialToSheets"
                    name="addMaterialToSheets"
                    onChange={(e) =>
                      setAdditionalFeatures((prev) => ({
                        ...prev,
                        addMaterialToSheets: e.target.checked,
                      }))
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group" style={{ display: "flex" }}>
                <label
                  htmlFor="panelLabel"
                  style={{
                    display: "block",
                    marginRight: "10px",
                    marginTop: "5px",
                  }}
                >
                  Labels on Panels:
                </label>
                <label className="switch">
                  <input
                    type="checkbox"
                    id="panelLabel"
                    name="panelLabel"
                    onChange={(e) =>
                      setAdditionalFeatures((prev) => ({
                        ...prev,
                        panelLabel: e.target.checked,
                      }))
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-group" style={{ display: "flex" }}>
                <label
                  htmlFor="singleSheet"
                  style={{
                    display: "block",
                    marginRight: "10px",
                    marginTop: "5px",
                  }}
                >
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
                  style={{ borderColor: "white" }}
                  width="1"
                  height="1"
                ></canvas>
              </div>
              {resultReady && (
                <>
                  <button
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#007bff",
                      color: "white",
                      cursor: "pointer",
                      borderRadius: "4px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginRight: "10px",
                      border: "none",
                      width: "300px",
                    }}
                    // onClick={generatePDF}
                    onClick={openPDFOptionSettings}
                  >
                    Download PDF
                  </button>
                  <GeneratePDF
                    globalSheetStatistics={globalSheetStatistics}
                    svgSheetArray={svgSheetArray}
                    panelRowData={panelRows}
                    stockRowData={stockSheetRows}
                    additionalFeatures={additionalFeatures}
                    notPlacedPanels={notPlacePanels}
                    generatePDFData={generatePDFData}
                    pdfFileName={pdfFileName}
                    pdfHeaderText={pdfHeaderText}
                    setGeneratePDFData={setGeneratePDFData}
                  />
                </>
              )}
              {optimizationCompleted && (
                <div>
                  <div className="container">
                    <div id="result" className="sheets">
                      Sheets representation will be displayed here
                    </div>
                  </div>
                  <div className="mb-5">
                    <GlobalSheetTable
                      globalSheetStatistics={globalSheetStatistics}
                    />
                  </div>
                  {notPlacePanels.length > 0 && (
                    <div className="mb-5">
                      <NotPlacedPanelTable
                        notPlacedPanelArray={notPlacePanels}
                      />
                    </div>
                  )}
                  <div className="mb-5">
                    <SheetTable sheetStatistics={sheetStatistics} />
                  </div>
                </div>
              )}
            </div>
            <br />
          </div>
        </div>
      )}

      <MetalWeightCalculator />
      <ErrorModal
        show={showErrorModal}
        onClose={handleCloseModal}
        messages={errors}
      />
      <PDFSettingModal
        showPdfModal={showPdfModal}
        setShowPdfModal={setShowPdfModal}
        pdfFileName={pdfFileName}
        setPdfFileName={setPdfFileName}
        pdfHeaderText={pdfHeaderText}
        setPdfHeaderText={setPdfHeaderText}
        setGeneratePDFData={setGeneratePDFData}
      />
    </div>
  );
};

export default Home;
