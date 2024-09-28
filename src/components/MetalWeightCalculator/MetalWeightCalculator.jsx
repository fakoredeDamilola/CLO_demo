import React, { useState } from "react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import "./styles.css";
import { loadCalculation } from "./function";

const WeightCalculator = () => {
  const [shape, setShape] = useState("");
  const [material, setMaterial] = useState("");
  const [customDensity, setCustomDensity] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("metric");
  const [costPerKg, setCostPerKg] = useState(0);
  const [transportCost, setTransportCost] = useState(0);
  const [miscCost, setMiscCost] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [result, setResult] = useState("");
  const [costResult, setCostResult] = useState("");

  const handleCalculate = () => {
    // Logic for calculation here
    setResult("Calculated weight and dimensions will be displayed here.");
  };

  const handleCostCalculation = () => {
    const totalCost = costPerKg * quantity + transportCost + miscCost;
    setCostResult(`Total Cost: ${totalCost}`);
  };

  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet([{ shape, material, quantity }]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Calculation");
    XLSX.writeFile(wb, "calculation.xlsx");
  };

  return (
    <div className={`container ${darkMode ? "dark-mode" : ""}`}>
      <h1>Alunex-Metal Weight Calculator</h1>

      {/* Dark Mode Toggle */}
      <div className="dark-mode-toggle">
        <label htmlFor="darkModeSwitch">Dark Mode:</label>
        <input
          type="checkbox"
          id="darkModeSwitch"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </div>

      <form id="calculator-form">
        {/* Shape Selection */}
        <div className="form-group">
          <label htmlFor="shape">Shape Selection:</label>
          <select
            id="shape"
            name="shape"
            value={shape}
            onChange={(e) => setShape(e.target.value)}
          >
            <option value="" disabled>
              Select Shape
            </option>
            <option value="plate">Plate</option>
            <option value="roundPipe">Round Pipe</option>
            <option value="squareBox">Square Box</option>
            <option value="rectangularBox">Rectangular Box</option>
            <option value="roundRod">Round Rod</option>
            <option value="lAngle">L-Angle</option>
            <option value="tAngle">T-Angle</option>
            <option value="iBeam">I-Beam</option>
            <option value="cChannel">C-Channel</option>
          </select>
        </div>

        {/* Material Selection */}
        <div className="form-group">
          <label htmlFor="material">Material Selection:</label>
          <select
            id="material"
            name="material"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          >
            <option value="" disabled>
              Select Material
            </option>
            <option value="steel">Steel</option>
            <option value="aluminum">Aluminum</option>
            <option value="stainlessSteel">Stainless Steel</option>
            <option value="glass">Glass</option>
            <option value="wood">Wood</option>
            <option value="copper">Copper</option>
            <option value="brass">Brass</option>
            <option value="bronze">Bronze</option>
            <option value="titanium">Titanium</option>
            <option value="custom">Custom Material</option>
          </select>
        </div>

        {/* Custom Density */}
        {material === "custom" && (
          <div className="form-group">
            <label htmlFor="customDensity">Custom Density (kg/m³):</label>
            <input
              type="number"
              id="customDensity"
              name="customDensity"
              min="1"
              step="any"
              value={customDensity}
              onChange={(e) => setCustomDensity(e.target.value)}
            />
          </div>
        )}

        {/* Quantity */}
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        {/* Calculate Button */}
        <button type="button" id="calculateBtn" onClick={handleCalculate}>
          Calculate
        </button>
      </form>

      {/* Result Section */}
      {result && (
        <div id="result" className="result-section">
          {result}
        </div>
      )}

      {/* Unit Conversion Toggle */}
      <div id="unit-conversion">
        <label htmlFor="unitToggle">Display Units:</label>
        <select
          id="unitToggle"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
        >
          <option value="metric">Metric (kg, m²)</option>
          <option value="imperial">Imperial (lbs, ft²)</option>
        </select>
      </div>

      {/* Cost Calculation Section */}
      <div id="cost-section">
        <h2>Cost Calculation</h2>
        <div className="form-group">
          <label htmlFor="costPerKg">Cost per kg:</label>
          <input
            type="number"
            id="costPerKg"
            name="costPerKg"
            min="0"
            step="any"
            value={costPerKg}
            onChange={(e) => setCostPerKg(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="transportCost">Transport Cost:</label>
          <input
            type="number"
            id="transportCost"
            name="transportCost"
            min="0"
            step="any"
            value={transportCost}
            onChange={(e) => setTransportCost(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="miscCost">Miscellaneous Cost:</label>
          <input
            type="number"
            id="miscCost"
            name="miscCost"
            min="0"
            step="any"
            value={miscCost}
            onChange={(e) => setMiscCost(e.target.value)}
          />
        </div>
        <button
          type="button"
          id="calculateCostBtn"
          onClick={handleCostCalculation}
        >
          Calculate Total Cost
        </button>
        {costResult && (
          <div id="costResult" className="result-section">
            {costResult}
          </div>
        )}
      </div>

      {/* Download Section */}
      <div id="download-section">
        <button
          type="button"
          id="downloadExcelBtn"
          onClick={handleDownloadExcel}
        >
          Download as Excel
        </button>
        <button type="button" id="downloadExcelBtn">
          Download as Excel
        </button>
        <button type="button" id="saveCalculationBtn">
          Save Calculation
        </button>
        <button type="button" id="loadCalculationBtn" onClick={loadCalculation}>
          Load Calculation
        </button>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer">
        <p>
          Note: While the calculated results are correct to the best of our
          knowledge, customers are advised to verify the calculations. We do not
          accept responsibility for any discrepancies.
        </p>
      </div>
    </div>
  );
};

export default WeightCalculator;
