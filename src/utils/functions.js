import { grainDirections } from "./constants";

function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters[randomIndex];
  }

  return result;
}

// Function to generate a random color in hexadecimal format
function getRandomColor() {
  const r = Math.floor(Math.random() * 128) + 128;
  const g = Math.floor(Math.random() * 128) + 128;
  const b = Math.floor(Math.random() * 128) + 128;

  const color = `rgb(${r},${g},${b})`;
  return color;
}

export function displayPanelAndSheetInfo(
  sheetTable,
  panelTable,
  additionalFeatures,
  panelThickness,
  unit
) {
  let panelInfo = "Panel Information:<br>";
  let sheetInfo = "Sheet Information:<br>";
  let detailInfo = "Detail Information:<br>-------<br>";
  let factorForStockSheet;

  // let panelRows = /* ... */;
  const panelData = [];
  const svgSheetArray = [];
  const panelGroupColors = {};
  const { considerGrainDirection, addMaterialToSheets, panelLabel } =
    additionalFeatures;

  console.clear();
  //   console.log(sheetTable);
  //   console.log(panelTable);
  // console.log({ considerGrainDirection, addMaterialToSheets, panelLabel });

  panelTable.forEach((row, index) => {
    if (index + 1 !== 0) {
      const name = row.label === "" ? generateRandomString(5) : row.label;
      if (!panelGroupColors[name]) {
        panelGroupColors[name] = getRandomColor();
      }

      const length = row.length;
      const width = row.width;
      const quantity = row.quantity;
      const grainDirection = row.grainDirection;
      const material = row.material;

      for (let i = 1; i <= quantity; i++) {
        panelData.push({
          pid: `${panelData.length + 1}`,
          panelGroup: `${name}`,
          panel: `${name}_q${i}`,
          length,
          width,
          qty: 1,
          placed: false,
          rotated: false,
          color: panelGroupColors[name], // Assign unique color for panelGroup
          grainDirection,
          material,
        });
      }
    }
  });

  // Extract sheet information
  const sheetData = [];
  sheetTable.forEach((row, index) => {
    let useRandomString = false,
      name = "";
    if (index + 1 !== 0) {
      name = row.label;
      if (row.label === "") {
        useRandomString = true;
        name = `${generateRandomString(5)}_${index}`;
      } else {
        name = row.label;
      }
      const length = row.length;
      const width = row.width;
      const quantity = row.quantity;
      const grainDirection = row.grainDirection;
      const material = row.material;

      for (let i = 1; i <= quantity; i++) {
        sheetInfo += `sid: ${
          sheetData.length + 1
        } sheet: ${name}_q${i} - Length: ${length}, Width: ${width}, useRandomString: ${useRandomString}<br>`;
        sheetData.push({
          sid: `${sheetData.length + 1}`,
          sheetGroup: `${name}`,
          sheet: `${name}_q${i}`,
          useRandomString,
          length,
          width,
          qty: 1,
          placed: false,
          grainDirection,
          material,
        });
      }
    }
  });

  // Call bestFitDecreasing function after extracting panel and sheet data

  function bestFitDecreasing(panels, sheets) {
    // Sort panels by area (length * width) in descending order
    const sortedPanels = panels.sort(
      (a, b) =>
        parseInt(b.length) * parseInt(b.width) -
        parseInt(a.length) * parseInt(a.width)
    );

    for (let i = 0; i < sheets.length; i++) {
      const sheet = sheets[i];
      if (!sheet.placed) {
        let sheetLength = parseInt(sheet.length);
        let sheetWidth = parseInt(sheet.width);

        // Apply grain direction to sheet independently
        if (considerGrainDirection && sheet.grainDirection === "vertical") {
          [sheetLength, sheetWidth] = [sheetWidth, sheetLength];
        }

        const grid = Array(sheetLength + panelThickness)
          .fill()
          .map(() => Array(sheetWidth + panelThickness).fill(0));
        let areaUsed = 0;

        // Filter panels by material type that matches the sheet material
        const materialSpecificPanels = sortedPanels.filter(
          (panel) => panel.material === sheet.material
        );

        for (let j = 0; j < materialSpecificPanels.length; j++) {
          const panel = materialSpecificPanels[j];

          if (!panel.placed) {
            let panelLength = parseInt(panel.length);
            let panelWidth = parseInt(panel.width);

            // Apply grain direction to panel independently
            for (let k = 0; k < 2; k++) {
              if (
                considerGrainDirection &&
                panel.grainDirection === "vertical"
              ) {
                [panelLength, panelWidth] = [panelWidth, panelLength];
              }

              const [length, width] =
                k === 0 ? [panelLength, panelWidth] : [panelWidth, panelLength];

              if (k === 1) {
                panel.rotated = true;
              } else {
                panel.rotated = false;
              }

              for (
                let row = 0;
                row <= grid.length - length - panelThickness;
                row++
              ) {
                for (
                  let col = 0;
                  col <= grid[0].length - width - panelThickness;
                  col++
                ) {
                  if (!grid[row][col]) {
                    let canPlace = true;

                    for (let r = row; r < row + length + panelThickness; r++) {
                      for (let c = col; c < col + width + panelThickness; c++) {
                        // Ensure placement doesn't exceed sheet boundaries
                        if (
                          r >= grid.length ||
                          c >= grid[0].length ||
                          grid[r][c]
                        ) {
                          canPlace = false;
                          break;
                        }
                      }
                      if (!canPlace) break;
                    }

                    if (canPlace) {
                      // Mark panel cells as occupied
                      for (
                        let r = row;
                        r < row + length + panelThickness;
                        r++
                      ) {
                        for (
                          let c = col;
                          c < col + width + panelThickness;
                          c++
                        ) {
                          grid[r][c] = 1;
                        }
                      }

                      panel.placed = true;
                      panel.x = col; // x-coordinate
                      panel.y = row; // y-coordinate
                      areaUsed += length * width;
                      const remainingArea = sheetLength * sheetWidth - areaUsed;
                      const remainingLength = sheetLength - row - length;
                      const remainingWidth = sheetWidth - col - width;

                      detailInfo += `Panel (${
                        panel.panel
                      }) ==> ${length} x ${width} ${
                        panel.rotated ? "(R)" : "(NR)"
                      } is placed on Sheet (${
                        sheet.sheet
                      }) ${sheetLength} x ${sheetWidth}. <br> Area used: ${areaUsed}, Remaining area: ${remainingArea}, Remaining length: ${remainingLength}, Remaining width: ${remainingWidth}, Placed: ${
                        panel.placed ? "true" : "false"
                      }, X: ${panel.x}, Y: ${panel.y}, panelGroup: (${
                        panel.panelGroup
                      }), sheetGroup: (${sheet.sheetGroup}), col: (${
                        panel.color
                      })<br>-----------<br>`;

                      break;
                    }
                  }
                }
                if (panel.placed) break;
              }
              if (panel.placed) break;
            }
          }
        }

        const allPlaced = materialSpecificPanels.every((panel) => panel.placed);
        if (allPlaced) {
          sheet.placed = true;
        }
      }
    }
  }

  bestFitDecreasing(panelData, sheetData);

  let totalCuts = 0; //total cut panel
  let panellenght = 0;

  panelInfo = "Panel Information:<br>";

  // Sort panelData by placed and then by pid
  panelData.sort((panelA, panelB) => {
    // First, sort by placed (true before false)
    if (panelA.placed !== panelB.placed) {
      return panelA.placed ? -1 : 1;
    } else {
      // If placed values are equal, sort by pid
      return panelA.pid - panelB.pid;
    }
  });
  let totalCutDetails = 0;
  let totalCutLength = 0;
  let notPlacedPanel = [];
  panelData.forEach((panel) => {
    if (panel.placed === true) {
      totalCuts++;
      panellenght += parseInt(panel.length);
    } else {
      notPlacedPanel.push(panel);
    }
    totalCutDetails += totalCuts;
    totalCutLength += panellenght;

    panelInfo += `pid: ${panel.pid} panel: ${panel.panel} - Length: ${
      panel.length
    }, Width: ${panel.width}, Placed: ${panel.placed ? "true" : "false"}<br>`;
  });

  // Calculate total area required for sheets
  let totalSheetWidth = 0;
  let totalSheetLength = 0;
  let canvas = document.getElementById("outerCanvas");
  let ctx = canvas.getContext("2d");

  sheetData.forEach((sheet) => {
    totalSheetWidth += parseInt(sheet.width);
    totalSheetLength += parseInt(sheet.length);
  });

  canvas.height = 20; // Adding 20px padding
  canvas.width = 20; // Adding 20px padding

  const panels = [];
  const sheetStatistics = [];

  const panelRegex =
    /Panel \((.*?)\) ==> (\d+) x (\d+) \((R|NR)\) is placed on Sheet \((.*?)\) (\d+) x (\d+)\. <br> Area used: (\d+), Remaining area: (\d+), Remaining length: (\d+), Remaining width: (\d+), Placed: (true|false), X: (\d+), Y: (\d+), panelGroup: \((.*?)\), sheetGroup: \((.*?)\), col: \((.*?)\)<br>-----------<br>/g;

  let match;
  while ((match = panelRegex.exec(detailInfo)) !== null) {
    const panel = {
      panelName: match[1],
      length: parseInt(match[2]),
      width: parseInt(match[3]),
      rotation: match[4],
      sheetName: match[5],
      sheetLength: parseInt(match[6]),
      sheetWidth: parseInt(match[7]),
      areaUsed: parseInt(match[8]),
      remainingArea: parseInt(match[9]),
      remainingLength: parseInt(match[10]),
      remainingWidth: parseInt(match[11]),
      placed: match[12] === "true",
      x: parseInt(match[13]),
      y: parseInt(match[14]),
      panelGroup: match[15],
      sheetGroup: match[16],
      panelColor: match[17],
    };
    panels.push(panel);
  }

  //---------------------------------------
  // sheets and panels arrays exist with relevant data

  // Step 1: Group panels based on sheetname
  const panelsBySheet = panels.reduce((acc, panel) => {
    if (!acc[panel.sheetName]) {
      acc[panel.sheetName] = [];
    }
    acc[panel.sheetName].push(panel);
    return acc;
  }, {});

  // Step 2: Place panels on respective sheets
  // the 'panelsBySheet' object correctly populated
  //------------------------------------
  let svgString = "";

  const margin = 25;

  const scale = 1;

  // Function to generate a unique key for a sheet based on its panels
  function generateSheetKey(sheetPanels) {
    return sheetPanels
      .map(
        (panel) =>
          `${panel.x}-${panel.y}-${panel.width}-${panel.length}-${panel.panelColor}`
      )
      .join("|");
  }

  const uniqueSheets = new Map();
  for (const sheetName in panelsBySheet) {
    const sheetPanels = panelsBySheet[sheetName];
    const sheetKey = generateSheetKey(sheetPanels);

    if (uniqueSheets.has(sheetKey)) {
      uniqueSheets.get(sheetKey).count++;
    } else {
      uniqueSheets.set(sheetKey, { panels: sheetPanels, count: 1 });
    }
  }

  let totalArea = 0;
  let totalAreaUsed = 0;
  let totalRemainingArea = 0;
  const sheetDetails = [];
  let totalSheetUsed = 0;
  let count_cut = 0;

  uniqueSheets.forEach((sheetData) => {
    const sheetName = sheetData.panels[0].sheetGroup;
    const sheetPanels = sheetData.panels;
    const sheetCount = sheetData.count;

    const sheetWidth = parseFloat(sheetPanels[0].sheetWidth);
    const sheetHeight = parseFloat(sheetPanels[0].sheetLength);

    // Create a 2D array to represent the sheet
    const sheetArray = Array.from({ length: Math.ceil(sheetHeight) }, () =>
      Array(Math.ceil(sheetWidth)).fill(0)
    );

    // Get the last panel for the current sheet
    const lastPanel = sheetPanels[sheetPanels.length - 1];

    // Calculate total area used and remaining area from the last panel of the sheet
    const sheetTotalAreaUsed = lastPanel.areaUsed;
    const sheetTotalRemainingArea = lastPanel.remainingArea;
    const sheetTotalArea = sheetTotalAreaUsed + sheetTotalRemainingArea;

    // Accumulate the values for all sheets
    totalArea += sheetTotalArea * sheetCount;
    totalAreaUsed += sheetTotalAreaUsed * sheetCount;
    totalRemainingArea += sheetTotalRemainingArea * sheetCount;
    sheetDetails.push(
      `(${sheetWidth}${unit} x ${sheetHeight}${unit}) X${sheetCount}`
    );

    factorForStockSheet = getFactorValueForStockSheet(sheetWidth, sheetHeight);
    totalSheetUsed += sheetCount;

    const { UIHeight, UIWidth } = factorForStockSheet;
    let newSVGSheet = "";
    // Container SVG with light yellow background
    newSVGSheet += `<svg width="${parseInt(UIWidth) + 100}" height="${
      parseInt(UIHeight) + 100
    }" xmlns="http://www.w3.org/2000/svg" style="background-color: lightyellow; margin: ${margin}px; position: relative;">`;

    // Inner sheet SVG with white background, without border
    newSVGSheet += `<svg width="${UIWidth}" height="${UIHeight}" x="${margin}" y="${margin}" style="background-color: white;">`;

    // Add a black border rectangle inside the sheet SVG
    newSVGSheet += `<rect x="0" y="0" width="${UIWidth}" height="${UIHeight}" fill="none" stroke="black" stroke-width="1"/>`;

    // Track the bounds of the used area
    let usedBounds = { maxX: 0, maxY: 0 };

    // Add panels to the SVG, mark used areas in the array, and track the unused spaces
    sheetPanels.forEach((panel, index) => {
      const scaledX = Math.floor(panel.x);
      const scaledY = Math.floor(panel.y);
      const scaledWidth = Math.floor(panel.width);
      const scaledLength = Math.floor(panel.length);

      // Mark used areas in the sheetArray
      for (let y = scaledY; y < scaledY + scaledLength; y++) {
        for (let x = scaledX; x < scaledX + scaledWidth; x++) {
          if (y < sheetArray.length && x < sheetArray[0].length) {
            sheetArray[y][x] = 1; // Mark as used
          }
        }
      }

      // Update the used bounds
      usedBounds.maxX = Math.max(usedBounds.maxX, scaledX + scaledWidth);
      usedBounds.maxY = Math.max(usedBounds.maxY, scaledY + scaledLength);

      // Draw the panel
      // reduce each panel size
      const panelLenghtReduced = scaledLength / factorForStockSheet.height;
      const panelWidthReduced = scaledWidth / factorForStockSheet.width;
      const positionX = scaledX / factorForStockSheet.width;
      const positionY = scaledY / factorForStockSheet.height;
      console.log({
        panelLenghtReduced,
        panelWidthReduced,
        factorForStockSheet,
      });
      if (panelLabel) {
        newSVGSheet += `<rect x="${positionX}" y="${positionY}" width="${panelWidthReduced}" height="${panelLenghtReduced}" fill="${
          panel.panelColor
        }" stroke="black" stroke-width="1" class="panel-rect">
          <title>${panel.panelName}: ${panel.length} x ${
          panel.width
        }, Rotation: ${
          panel.rotation
        }, Panel (XY): ${scaledX} ${scaledY}</title>
        </rect>
        <text x="${positionX + panelWidthReduced / 2}" y="${
          positionY + 25
        }" text-anchor="middle" font-size="10" fill="black">${
          panel.panelName
        }</text>
        <text x="${positionX + 10}" y="${
          positionY + panelLenghtReduced / 2
        }" text-anchor="left" font-size="8" fill="black" transform="rotate(-90, ${
          positionX + 10
        }, ${positionY + panelLenghtReduced / 2})">${panel.length}</text>
        <text x="${positionX + panelWidthReduced / 2}" y="${
          positionY + 10
        }" text-anchor="middle" font-size="8" fill="black">${
          panel.width
        }</text>`;
      } else {
        newSVGSheet += `<rect x="${positionX}" y="${positionY}" width="${panelWidthReduced}" height="${panelLenghtReduced}" fill="${panel.panelColor}" vector-effect="non-scaling-stroke" stroke="black" stroke-width="1" class="panel-rect">
          <title>${panel.panelName}: ${panel.length} x ${panel.width}, Rotation: ${panel.rotation}, Panel (XY): ${scaledX} ${scaledY}</title>
        </rect>`;
      }
    }); // End of sheetPanels.forEach

    // Find and draw unused spaces
    for (let y = 0; y < sheetArray.length; y++) {
      for (let x = 0; x < sheetArray[0].length; x++) {
        if (sheetArray[y][x] === 0) {
          // Unused area found
          let width = 1;
          let height = 1;

          // Extend the width
          while (
            x + width < sheetArray[0].length &&
            sheetArray[y][x + width] === 0
          ) {
            width++;
          }

          // Extend the height
          while (
            y + height < sheetArray.length &&
            sheetArray[y + height].slice(x, x + width).every((val) => val === 0)
          ) {
            height++;
          }

          // reduce the size of unused sheet and height
          const unusedSheetWidthReduced = width / factorForStockSheet.width;
          const unusedSheetHeightReduced = height / factorForStockSheet.height;
          const unusedXPosition = x / factorForStockSheet.width;
          const unusedYPosition = y / factorForStockSheet.height;

          // Draw the unused area

          count_cut++;
          newSVGSheet += `<rect x="${unusedXPosition}" y="${unusedYPosition}" width="${unusedSheetWidthReduced}" height="${unusedSheetHeightReduced}" fill="lightgrey" opacity="0.5" stroke="blue" stroke-width="1">
            <title>Unused Area ${count_cut}: (W:${width} x H:${height}) x="${x}" y="${y}"</title>
          </rect>`;

          // Mark this area as used to avoid redrawing
          for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
              sheetArray[y + i][x + j] = 1; // Mark as used
            }
          }
        }
      }
    }

    newSVGSheet += `</svg>`; // Closing sheet SVG

    // Add sheet length and width labels outside the sheet border
    newSVGSheet += `<text x="${UIWidth + margin + 30}" y="${
      UIHeight / 2 + margin
    }" fill="red" font-size="14" transform="rotate(-90, ${
      UIWidth + margin + 30
    }, ${UIHeight / 2 + margin})">${sheetHeight}</text>`;

    newSVGSheet += `<line x1="${UIWidth + margin + 15}" y1="${margin}" x2="${
      UIWidth + margin + 15
    }" y2="${
      UIHeight + margin
    }" stroke="red" stroke-width="1" marker-end="url(#arrow)" marker-start="url(#arrow)"/>`;

    newSVGSheet += `<text x="${UIWidth / 2.5}" y="${
      UIHeight + margin + 17
    }" fill="red" font-size="14">${sheetWidth}</text>`;

    newSVGSheet += `<line x1="${margin}" y1="${UIHeight + margin + 20}" x2="${
      UIWidth + margin
    }" y2="${
      UIHeight + margin + 20
    }" stroke="red" stroke-width="1" marker-end="url(#arrow)" marker-start="url(#arrow)"/>`;

    // Define the arrow marker
    newSVGSheet += `<defs><marker id="arrow" viewBox="0 0 2 10" refX="1" refY="5" markerWidth="2" markerHeight="10" orient="auto"><rect x="0" y="0" width="2" height="10" fill="red"/></marker></defs>`;

    // Add the sheet count label outside the inner sheet SVG, at the bottom
    newSVGSheet += `<text x="${margin}" y="${
      UIHeight + margin + 40
    }" fill="black" font-size="16px">${sheetName}: x${sheetCount} </text>`;

    newSVGSheet += `</svg>`; // Closing container SVG

    const totalAreaUsedPercentage = (
      (sheetTotalAreaUsed / sheetTotalArea) *
      100
    ).toFixed(2);
    const individualSheetDetails = {
      stockSheetWidth: sheetWidth,
      stockSheetHeight: sheetHeight,
      usedArea: sheetTotalAreaUsed,
      totalAreaUsedPercentage: `${totalAreaUsedPercentage}%`,
      wastedArea: sheetTotalArea - sheetTotalAreaUsed,
      totalWastedAreaPercentage: `${(100 - totalAreaUsedPercentage).toFixed(
        2
      )}%`,
      panels: sheetData.panels.length,
      // material:s
    };
    for (let i = 1; i <= sheetCount; i++) {
      sheetStatistics.push(individualSheetDetails);
    }

    svgString += newSVGSheet;
    svgSheetArray.push({
      newSVGSheet,
      sheetInfo: { ...individualSheetDetails, sheetCount },
    });
  }); // End of uniqueSheets.forEach

  // Calculate overall percentages
  const totalUsedAreaPercentage = (totalAreaUsed / totalArea) * 100;
  const totalWastedAreaPercentage = 100 - totalUsedAreaPercentage;
  const percentTotalArea = totalUsedAreaPercentage + totalWastedAreaPercentage;

  //Total cut
  totalCuts += count_cut;
  // log += `${totalCuts} ${count_cut}`

  document.getElementById("svgContainer").innerHTML = svgString;
  // document.getElementById("log").innerHTML = log;

  const singleSheet = document.getElementById("singleSheet").checked
    ? "on"
    : "off";

  let notPlacedPanelArray = [];

  if (notPlacedPanel.length > 0) {
    notPlacedPanelArray = computeNotPlacedPanelToGroups(notPlacedPanel);
  }

  const totalData = {
    totalArea,
    percentTotalArea,
    panelThickness,
  };
  const globalSheetStatistics = {
    totalAreaUsed,
    totalUsedAreaPercentage: totalUsedAreaPercentage.toFixed(2),
    totalCutLength,
    totalCuts,
    totalWastedArea: totalRemainingArea,
    totalWastedAreaPercentage: totalWastedAreaPercentage.toFixed(2),
    panelThickness,
    sheetDetails,
    // notPlacedPanel: notPlacedPanel.length,
    totalParts: panelData.length - notPlacedPanel.length,
    totalSheetUsed,
  };
  return {
    totalData,
    sheetStatistics,
    globalSheetStatistics,
    notPlacedPanelArray,
    svgString,
    svgSheetArray,
  };
}

function checkForErrorInData(data, panelLabel, item) {
  let response = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].selected && panelLabel && data[i].label === "") {
      response.push({
        type: "warning",
        message: `${item} row ${i} label is missing, a random panel Label will be added for you`,
        continue: true,
      });
    }
    if (
      data[i].selected &&
      (data[i].width === "" || data[i].length === "" || data[i].quantity === "")
    ) {
      response.push({
        type: "error",
        message: `${item} row ${i} width, length, quantity are missing, please fill them in`,
        continue: false,
      });
    }
  }
  return response;
}

function getFactorValueForStockSheet(width, height) {
  const UIWidth = 500;
  const UIHeight = 500;

  let factorDimensions = {};

  factorDimensions.width = width / UIWidth;
  factorDimensions.height = height / UIHeight;
  factorDimensions.UIWidth = UIWidth;
  factorDimensions.UIHeight = UIHeight;
  return factorDimensions;
}

export function checkForErrors(
  filteredStockSheet,
  filteredPanelSheet,
  panelLabel
) {
  const response = [];

  if (filteredStockSheet.length === 0) {
    response.push({
      type: "error",
      message: "Please add at least a stock sheet",
      continue: false,
    });
  } else if (filteredPanelSheet.length === 0) {
    response.push({
      type: "error",
      message: "Please add at least a panel",
      continue: false,
    });
  }

  const sheetError = checkForErrorInData(
    filteredStockSheet,
    panelLabel,
    "stock sheet"
  );
  const panelError = checkForErrorInData(
    filteredPanelSheet,
    panelLabel,
    "panel"
  );
  console.log([...response, ...sheetError, ...panelError]);
  return [...response, ...sheetError, ...panelError];
}

export function checkForErrorInExcelFile(data) {
  const errorResponse = [];

  for (let i = 0; i < data.length; i++) {
    if (!grainDirections.includes(data[i].grainDirection)) {
      errorResponse.push({
        type: "error",
        message: `grainDirection in file upload ${data[i].grainDirection} not found`,
        continue: false,
      });
    }
  }
  return errorResponse;
}

function computeNotPlacedPanelToGroups(notPlacedPanel) {
  const notPlacedPanelArray = notPlacedPanel.reduce((acc, current) => {
    const findGroup = acc.findIndex(
      (group) => group.groupName === current.panelGroup
    );
    if (findGroup >= 0) {
      acc[findGroup].panelCount++;
    } else {
      const newPanelGroup = {
        groupName: current.panelGroup,
        panelCount: 1,
        panelWidth: current.width,
        panelLength: current.length,
      };
      acc.push(newPanelGroup);
    }
    return acc;
  }, []);
  return notPlacedPanelArray;
}
