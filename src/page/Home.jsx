import React, { useState } from 'react'
import Worksheet from '../components/Worksheet'
import Stocksheet from '../components/Stocksheet'
import Results from '../components/Results';
import PlacementDetails from '../components/PlacementDetails';
// import { Box } from '@mui/material'

const Home = () => {

    const [panelDivs, setPanelDivs] = useState([]);
    const [panelLabels, setPanelLabels] = useState([]);
    const [stockWidth, setStockWidth] = useState(0);
    const [totalCutLength, setTotalCutLength] = useState(0);
    const [usedStockSheets, setUsedStockSheets] = useState("");
    const [rows, setRows] = useState([
        {id: 1, height: "", quantity: "", width: "", result: ""},
      ]);
     const [placementDetails,setPlacementDetails] = useState([])
    const [totalUsedArea, setTotalUsedArea] = useState("");
    const [totalWastedArea, setTotalWastedArea] = useState("");
    const [totalCuts, setTotalCuts] = useState("");
  const [stockSheetStyle, setStockSheetStyle] = useState({
    width: "0",
    height: "0",
  });
  const [stockRows, setStockRows] = useState([
    {id: 1, height: "", quantity: "", width: "", result: ""},
  ]);


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

    //   const stockLength = inputValues.totalStockHeight;
    //   const stockWidth = inputValues.totalStockWidth;

      // Sort the panels based on area (larger panels first)
     
      rows.sort((rowA, rowB) => {
        const areaA = parseInt(rowA.length) * parseInt(rowA.width);
        const areaB = parseInt(rowB.length) * parseInt(rowB.width);
        return areaB - areaA;
      });
    //   const stockSheet = document.getElementById("stockSheet");
    //   setStockSheetStyle({
    //     width: stockWidth + "px",
    //     height: stockLength + "px",
    //   });

    //   setStockWidth(stockWidth);

    //   const matrix = Array.from({length: stockLength + 1}, () =>
    //     Array(stockWidth + 1).fill(false)
    //   );
    //   console.log({matrix});
      let totalCutLength = 0;
      const parentPanel = [];
      const parentLabel = [];
    //   let totalWasteArea = stockLength * stockWidth;
      let totalUsedArea = 0;
    //   rows.forEach((panel) => {
    //     const panelWidth = parseInt(panel.width);
    //     const panelHeight = parseInt(panel.height);
    //     const panelQuantity = parseInt(panel.quantity);
    //     let panelDiv = {};
    //     let panelLabel = {};
    //     let bgColor = getColorForPanel(panelWidth, panelHeight);
    //     console.log({bgColor});
    //     console.log({panelHeight, panelWidth, panelQuantity, panel});
    //     for (let i = 0; i < panelQuantity; i++) {
    //       let placed = false;

    //       for (let row = 0; row <= stockLength - panelHeight; row++) {
    //         for (let col = 0; col <= stockWidth - panelWidth; col++) {
    //           let fits = true;

    //           for (let r = row; r < row + panelHeight; r++) {
    //             for (let c = col; c < col + panelWidth; c++) {
    //               if (matrix[r][c]) {
    //                 fits = false;
    //                 break;
    //               }
    //             }
    //             if (!fits) break;
    //           }

    //           if (fits) {
    //             for (let r = row; r < row + panelHeight; r++) {
    //               for (let c = col; c < col + panelWidth; c++) {
    //                 matrix[r][c] = true;
    //               }
    //             }
    //             panelDiv = {
    //               id: parseInt(Math.random() * row),
    //               className: "panel",
    //               style: {
    //                 width: panelWidth + "px",
    //                 height: panelHeight + "px",
    //                 left: col + "px",
    //                 top: row + "px",
    //                 backgroundColor: bgColor,
    //               },
    //             };
    //             panelLabel = {
    //               id: parseInt(Math.random() * row),
    //               className: "dimension-label",
    //               style: {
    //                 width: panelWidth + "px",
    //                 height: panelHeight + "px",
    //               },
    //               width: panelWidth,
    //               height: panelHeight,
    //             };
    //             let area = panelWidth * panelHeight;
    //             totalWasteArea -= area;
    //             totalUsedArea += area;
    //             parentPanel.push(panelDiv);
    //             parentLabel.push(panelLabel);
    //             placed = true;
    //             break;
    //           }
    //         }
    //         if (placed) break;
    //       }

    //       if (!placed) {
    //         alert("Insufficient stock space.");
    //         return;
    //       }
    //       totalCutLength += panelWidth + panelHeight;
    //     }

    //     panelsTotal += panelQuantity;
    //     console.log({panelQuantity, panelsTotal, panelsPlaced});
    //     // After placing all the panels, calculate the statistics
    //     totalCuts = panelsPlaced;
    //   });

    //   setPanelDivs(parentPanel);
    //   setPanelLabels(parentLabel);
    //   setUsedStockSheets(`${stockLength} ×${stockWidth} x${stockSheet}`);

    //   setTotalWastedArea(totalWasteArea);
    //   setTotalUsedArea(totalUsedArea);
    //   setTotalCuts(totalCuts);
    //   setTotalCutLength("6666");
    // User-provided stock sheet data

  // Function to select stock sheets for panels
  // User-provided stock sheet data
const stockSheets = [
    { length: 100, width: 50, quantity: 2 },
    { length: 120, width: 60, quantity: 3 },
  ];
  
  // User-provided panel data
  const panels = [
    { width: 30, height: 40, quantity: 5 },
    { width: 70, height: 80, quantity: 4 },
    { width: 90, height: 45, quantity: 2 },
  ];
  
  // Function to select stock sheets for panels
 // User-provided stock sheet data

  // Initialize an array to store placement details for the UI

  
  function selectStockSheets(stockSheets, panels) {
    const placementDetails = []; // Initialize the placementDetails array here
  
    // Sort stock sheets by area in descending order (for better utilization)
    stockSheets.sort((a, b) => parseInt(b.height) * parseInt(b.width) - parseInt(a.height) * parseInt(a.width));
  
    // Sort panels by area in descending order (for best fit)
    panels.sort((a, b) => parseInt(b.width) * parseInt(b.height) - parseInt(a.width) * parseInt(a.height));
  
    // Iterate through the available panels
    for (const panel of panels) {
      const { width, height, quantity } = panel;
      let panelsRemaining = quantity;
  
      // Iterate through the available stock sheets
      for (const sheet of stockSheets) {
        if (sheet.quantity > 0) {
          const spaceAvailable = parseInt(sheet.height) * parseInt(sheet.width);
  
          // Try to fit the panel into the current stock sheet
          const fitResult = fitPanel(spaceAvailable, width, height, sheet.width);
  
          if (fitResult) {
            // Update stock sheet quantity and placement details
            sheet.quantity -= 1;
            panelsRemaining -= 1;
  
            // Generate a unique color for this stock sheet
            const color = getRandomColor();
  
            // Store placement details in the array with position
            placementDetails.push({
              stockSheet: { width: parseInt(sheet.width), height: parseInt(sheet.height), color },
              panel: {
                width,
                height,
                color,
                position: fitResult, // Position where the panel fits
              },
            });
  
            break; // Move to the next panel
          }
        }
      }
    }
  
    // Return the placementDetails array
    console.log(placementDetails)
    setPlacementDetails(placementDetails)
  }
  
  // Function to calculate the best fit position for a panel
 // Function to calculate the best fit position for a panel
function fitPanel(spaceAvailable, panelWidth, panelHeight, sheetWidth) {
    if (spaceAvailable >= panelWidth * panelHeight) {
      // If the panel fits perfectly, position it at the top-left corner
      if (spaceAvailable === panelWidth * panelHeight) {
        return { top: 0, left: 0 };
      }
  
      // Otherwise, calculate the best fit position to minimize waste
      let bestFit = { top: 0, left: 0, waste: Infinity };
  
      for (let top = 0; top <= sheetWidth - panelHeight; top++) {
        for (let left = 0; left <= sheetWidth - panelWidth; left++) {
          const panelArea = panelWidth * panelHeight;
          const spaceUsed = (sheetWidth - left) * panelHeight;
          const waste = spaceAvailable - spaceUsed;
  
          if (waste < bestFit.waste) {
            bestFit = { top, left, waste };
          }
        }
      }
  
      return bestFit;
    }
  
    return null; // Panel doesn't fit
  }
  
  
// function selectStockSheets(stockSheets, panels) {
//     const placementDetails = []; // Initialize the placementDetails array here
  
//     // Sort stock sheets by area in descending order (for better utilization)
//     stockSheets.sort((a, b) => parseInt(b.height) * parseInt(b.width) - parseInt(a.height) * parseInt(a.width));
  
//     for (const panel of panels) {
//       const { width, height, quantity } = panel;
  
//       for (let i = 0; i < quantity; i++) {
//         let panelPlaced = false;
  
//         for (const sheet of stockSheets) {
//           if (sheet.quantity > 0) {
//             const spaceAvailable = parseInt(sheet.height) * parseInt(sheet.width);
//             const panelArea = parseInt(width) * parseInt(height);
  
//             if (spaceAvailable >= panelArea) {
//               // Update stock sheet quantity and placement details
//               sheet.quantity -= 1;
  
//               // Store placement details in the array
//               placementDetails.push({
//                 stockSheet: { width: parseInt(sheet.width), height: parseInt(sheet.height) },
//                 panel: { width, height },
//               });
  
//               panelPlaced = true;
//               break;
//             }
//           }
//         }
  
//         // If the panel couldn't be placed on any stock sheet, create a new one
//         if (!panelPlaced) {
//           console.log(`Panel ${width}x${height} could not be placed on any stock sheet.`);
//           const newSheet = stockSheets.find((sheet) => sheet.quantity > 0);
  
//           if (!newSheet) {
//             console.log(`No more stock sheets available for panel ${width}x${height}.`);
//             break;
//           }
  
//           newSheet.quantity -= 1;
  
//           // Store placement details in the array
//           placementDetails.push({
//             stockSheet: { width: parseInt(newSheet.width), height: parseInt(newSheet.height) },
//             panel: { width, height },
//           });
//         }
//       }
//     }
  
//     // Return the placementDetails array
//     return placementDetails;
//   }
  
  // Rest of the code remains the same as in the previous example
  
  // Function to generate a random color (for uniqueness)
  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  // Select stock sheets for the panels
  const placementDetails = selectStockSheets(stockRows, rows);
  
  // Now, you can use the placementDetails array to create the UI representation.
  console.log({ placementDetails });
  setPlacementDetails(placementDetails)
  // Select stock sheets for the panels
  
    }
  };
    

  return (
    <div className="container">
        <Stocksheet 
        setStockRows={setStockRows} 
        stockRows={stockRows}
         />
    <Worksheet 
    rows={rows}
    setRows={setRows}
    setStockWidth={setStockWidth}
    setStockSheetStyle={setStockSheetStyle}
    getColorForPanel={getColorForPanel}
    optimizeData={optimizeData}
   totalCutLength={totalCutLength}
   usedStockSheets={usedStockSheets}
   totalUsedArea={totalUsedArea}
   totalWastedArea={totalWastedArea}
   totalCuts={totalCuts}
    />
      {/*  */}
      <PlacementDetails placementDetails={placementDetails} />
    {/* <Results
   panelDivs={panelDivs}
   panelLabels={panelLabels}
   stockSheetStyle={stockSheetStyle}
   stockWidth={stockWidth}
   /> */}
  </div>
  )
}

export default Home