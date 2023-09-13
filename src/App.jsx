import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Header from "./components/Header";
import Worksheet from "./components/Worksheet";
// import Panelsheet from "./components/Panelsheet";
// import Stocksheet from "./components/Stocksheet";
import Accordion from "react-bootstrap/Accordion";

function App() {
<<<<<<< HEAD
  const optimizeData = () => {
    function optimize() {
      if (!validateInputs()) {
        alert("Please fill in all panel input fields before optimizing.");
        return;
      }
      //document.getElementById('totalCutLength').value = "567";
      // Clear previous optimization
      panelContainer.innerHTML = "";
      var totalUsedArea = 0;
      var totalWastedArea = 0;
      var totalCuts = 0;
      var panelsPlaced = 0;
      var panelsTotal = 0;
      // Fetch the panels and stock dimensions
      const panels = Array.from(panelInputs.querySelectorAll(".panelInput"));
      const stockLength = parseInt(stockLengthInput.value);
      const stockWidth = parseInt(stockWidthInput.value);

      // Sort the panels based on area (larger panels first)
      panels.sort((a, b) => {
        const areaA =
          parseInt(a.querySelector(".panelWidth").value) *
          parseInt(a.querySelector(".panelHeight").value);
        const areaB =
          parseInt(b.querySelector(".panelWidth").value) *
          parseInt(b.querySelector(".panelHeight").value);
        return areaB - areaA;
      });

      // Create the stock sheet element with background
      const stockSheet = document.createElement("div");
      stockSheet.className = "stock-sheet";
      stockSheet.style.width = stockWidth + "px";
      stockSheet.style.height = stockLength + "px";

      // Add dimension label with arrow for stock sheet
      const stockLabel = document.createElement("div");
      stockLabel.className = "dimension-label";
      stockLabel.style.width = stockWidth + "px";
      stockLabel.innerHTML = `${stockWidth} <span class="dimension-arrow">&rarr;</span>`;
      stockSheet.appendChild(stockLabel);

      panelContainer.appendChild(stockSheet);

      const matrix = Array.from({length: stockLength + 1}, () =>
        Array(stockWidth + 1).fill(false)
      );
      let totalCutLength = 0;
      panels.forEach((panel) => {
        const panelWidth = parseInt(panel.querySelector(".panelWidth").value);
        const panelHeight = parseInt(panel.querySelector(".panelHeight").value);
        const panelQuantity = parseInt(
          panel.querySelector(".panelQuantity").value
        );

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

                const panelDiv = document.createElement("div");
                panelDiv.className = "panel";
                panelDiv.style.width = panelWidth + "px";
                panelDiv.style.height = panelHeight + "px";
                panelDiv.style.left = col + "px";
                panelDiv.style.top = row + "px";
                panelDiv.style.backgroundColor = getColorForPanel(
                  panelWidth,
                  panelHeight
                ); // Set background color
                // Add dimension label with arrow for panels
                // Add dimension label with arrow for panels
                const panelLabel = document.createElement("div");
                panelLabel.className = "dimension-label";
                panelLabel.style.width = panelWidth + "px";
                panelLabel.style.height = panelHeight + "px";
                panelLabel.innerHTML = `${panelWidth} <span class="dimension-arrow">&rarr;</span> 
                ${panelHeight} <span class="dimension-arrow">&darr;</span>`;
                panelDiv.appendChild(panelLabel);
                stockSheet.appendChild(panelDiv);

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
        // After placing all the panels, calculate the statistics
        totalUsedArea = stockLength * stockWidth * (panelsPlaced / panelsTotal);
        totalWastedArea = stockLength * stockWidth - totalUsedArea;
        totalCuts = panelsPlaced;
        console.log("wasted area= ", totalWastedArea);
        console.log("used area= ", totalUsedArea);
      });

      //Update the statistics in the HTML
      //document.getElementById('totalCutLength').value = `${totalCutLength} (or ${totalCutLength.toFixed(2)} feet)`;
      // Update the statistics in the HTML
      document.getElementById("usedStockSheets").value = String(
        `${stockLength} ×${stockWidth} x${stockSheet}`
      );
      document.getElementById("totalUsedArea").value = `${totalUsedArea} (${(
        (totalUsedArea / (stockLength * stockWidth)) *
        100
      ).toFixed(2)}%)`;
      document.getElementById(
        "totalWastedArea"
      ).value = `${totalWastedArea} (${(
        (totalWastedArea / (stockLength * stockWidth)) *
        100
      ).toFixed(2)}%)`;
      document.getElementById("totalCuts").value = totalCuts;
      document.getElementById("totalCutLength").value = "6666"; //  totalCutLength.toString();
      stockSheetImage = stockSheetToImage(stockSheet);
      const downloadButton = document.getElementById("downloadImage");
      //downloadButton.style.display = 'block';
      console.log("wasted area= ", totalWastedArea);
      console.log("used area= ", totalUsedArea);
    }
  };
  return (
    <>
      <Header optimizeData={optimizeData} />
      <Worksheet />
      <div className="my-4 text-danger">
        <p>
          For the sake of the demo the follow assumptions were made for stock
        </p>
        <p>
          requiredLength = 1 <br /> requiredAmount = 1 <br /> requiredWidth = 1;
        </p>
      </div>
=======
  const [stockData, setStockData] = useState([]);
  const [panelData, setPanelData] = useState([]);

  const handleStockDataChange = (data) => {
    setStockData(data);
  };

  const handlePanelDataChange = (data) => {
    setPanelData(data);
  };

  const performCutlistOptimization = (stockData, panelData) => {
    const requiredLength = stockData.length;
    const requiredAmount = stockData.amount;
    const requiredWidth = stockData.width;

    const availableLength = panelData.length;
    const availableAmount = panelData.amount;
    const availableWidth = panelData.width;

    const availableArea = availableLength * availableAmount * availableWidth;
    const requiredArea = requiredLength * requiredAmount * requiredWidth;

    if (
      availableLength >= requiredLength &&
      availableAmount >= requiredAmount &&
      availableWidth >= requiredWidth
    ) {
      const usedStocksTotalArea = requiredArea;
      const totalPanelsArea = availableArea;
      const totalRequiredPanels = Math.ceil(availableArea / requiredArea);

      const totalYield = totalPanelsArea - totalRequiredPanels * requiredArea;

      return {
        totalYield,
        usedStocksTotalArea,
        totalPanelsArea,
        totalRequiredPanels,
      };
    } else {
      return "Insufficient stock";
    }
  };

  const handleOptimization = () => {
    // You can access and utilize the data to perform the necessary calculations
    console.log("Stock Data:", stockData);
    console.log("Panel Data:", panelData);
    // Perform the optimization computation using stockData and panelData
    const optimizationResult = performCutlistOptimization(stockData, panelData);

    console.log("Optimization Result:", optimizationResult);
  };
  return (
    <>
      <Header />
      <Accordion defaultActiveKey={["0", "1"]} alwaysOpen flush>
        <Accordion.Item eventKey="0">
          <Accordion.Header className="bg-dark text-light">
            Stock
          </Accordion.Header>
          <Accordion.Body>
            <Worksheet
              // title={"Stock"}
              onDataChange={handleStockDataChange}
              onOptimization={handleOptimization}
            />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>Panel</Accordion.Header>
          <Accordion.Body>
            <Worksheet
              // title={"Panel"}
              onDataChange={handlePanelDataChange}
              onOptimization={handleOptimization}
            />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
>>>>>>> a358cc2693503aabb35daec1d21b4199f4ad7c9a
    </>
  );
}

export default App;
