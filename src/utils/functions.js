export function displayPanelAndSheetInfo(
  sheetTable,
  panelTable,
  panelThickness,
  unit
) {
  let panelInfo = "Panel Information:<br>";
  let sheetInfo = "Sheet Information:<br>";
  let detailInfo = "Detail Information:<br>-------<br>";

  // Function to generate a random color in hexadecimal format
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Assuming panelRows is fetched or declared somewhere in your code
  // let panelRows = /* ... */;
  const panelData = [];
  const panelGroupColors = {};

  panelTable.forEach((row, index) => {
    if (index + 1 !== 0) {
      const name = row.label;
      if (!panelGroupColors[name]) {
        panelGroupColors[name] = getRandomColor();
      }

      const length = row.length;
      const width = row.width;
      const quantity = row.quantity;
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
        });
      }
    }
  });

  // Extract sheet information
  const sheetData = [];
  sheetTable.forEach((row, index) => {
    if (index + 1 !== 0) {
      const name = row.label;
      const length = row.length;
      const width = row.width;
      const quantity = row.quantity;

      for (let i = 1; i <= quantity; i++) {
        sheetInfo += `sid: ${
          sheetData.length + 1
        } sheet: ${name}_q${i} - Length: ${length}, Width: ${width}<br>`;
        sheetData.push({
          sid: `${sheetData.length + 1}`,
          sheetGroup: `${name}`,
          sheet: `${name}_q${i}`,
          length,
          width,
          qty: 1,
          placed: false,
        });
      }
    }
  });
  // Call bestFitDecreasing function after extracting panel and sheet data

  function bestFitDecreasing(panels, sheets) {
    // console.clear();
    const sortedPanels = panels.sort(
      (a, b) =>
        parseInt(b.length) * parseInt(b.width) -
        parseInt(a.length) * parseInt(a.width)
    );

    for (let i = 0; i < sheets.length; i++) {
      const sheet = sheets[i];
      if (!sheet.placed) {
        const grid = Array(parseInt(sheet.length))
          .fill()
          .map(() => Array(parseInt(sheet.width)).fill(0));
        let areaUsed = 0;

        for (let j = 0; j < sortedPanels.length; j++) {
          const panel = sortedPanels[j];

          if (!panel.placed) {
            const panelLength = parseInt(panel.length);
            const panelWidth = parseInt(panel.width);

            for (let k = 0; k < 2; k++) {
              const [length, width] =
                k === 0 ? [panelLength, panelWidth] : [panelWidth, panelLength];
              if (k === 1) {
                panel.rotated = true;
              } else {
                panel.rotated = false;
              }
              for (let row = 0; row <= grid.length - length; row++) {
                for (let col = 0; col <= grid[0].length - width; col++) {
                  if (!grid[row][col]) {
                    let canPlace = true;

                    for (let r = row; r < row + length; r++) {
                      for (let c = col; c < col + width; c++) {
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
                      for (let r = row; r < row + length; r++) {
                        for (let c = col; c < col + width; c++) {
                          grid[r][c] = 1;
                        }
                      }

                      panel.placed = true;
                      panel.x = col; // x-coordinate
                      panel.y = row; // y-coordinate
                      areaUsed += length * width;
                      const remainingArea =
                        sheet.length * sheet.width - areaUsed;
                      const remainingLength = sheet.length - row - length;
                      const remainingWidth = sheet.width - col - width;

                      detailInfo += `Panel (${
                        panel.panel
                      }) ==> ${length} x ${width} ${
                        panel.rotated ? "(R)" : "(NR)"
                      } is placed on Sheet (${sheet.sheet}) ${sheet.length} x ${
                        sheet.width
                      }. <br> Area used: ${areaUsed}, Remaining area: ${remainingArea}, Remaining length: ${remainingLength}, Remaining width: ${remainingWidth}, Placed: ${
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

        const allPlaced = sortedPanels.every((panel) => panel.placed);
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

  panelData.forEach((panel) => {
    if (panel.placed === true) {
      totalCuts++;
      panellenght += parseInt(panel.length);
    }
    totalCutDetails += totalCuts;
    totalCutLength += panellenght;

    panelInfo += `pid: ${panel.pid} panel: ${panel.panel} - Length: ${
      panel.length
    }, Width: ${panel.width}, Placed: ${panel.placed ? "true" : "false"}<br>`;
  });

  // full result -------------------------
  //document.getElementById('result').innerHTML = panelInfo + '<br>' + sheetInfo + '<br>' + detailInfo;

  // -----------------------------------------------------------------

  // Calculate total area required for sheets
  let totalSheetWidth = 0;
  let totalSheetLength = 0;
  let canvas = document.getElementById("outerCanvas");
  let ctx = canvas.getContext("2d");

  sheetData.forEach((sheet) => {
    totalSheetWidth += parseInt(sheet.width);
    totalSheetLength += parseInt(sheet.length);
  });

  // Set canvas dimensions based on total sheet area with some padding
  canvas.height = 20; // Adding 20px padding
  canvas.width = 20; // Adding 20px padding

  // Display total width and height labels outside the canvas
  // const totalWidthLabel = document.getElementById('totalWidthLabel');
  // const totalHeightLabel = document.getElementById('totalSheetLength');

  // totalWidthLabel.innerHTML = `${totalSheetWidth}`;
  // totalHeightLabel.innerHTML = `${totalSheetLength}`;

  //---------------------------------------------------------------------

  const panels = [];
  let TAused = 0;
  let remArea = 0;

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
  let xx = "";

  const containerWidth = 800; // Define the container width in pixels
  const containerHeight = 600; // Define the container height in pixels
  const margin = 10;

  // Determine the scaling factor based on the container size
  const maxSheetWidth = Math.max(...sheetData.map((sheet) => sheet.width));
  const maxSheetHeight = Math.max(...sheetData.map((sheet) => sheet.length));

  const scaleX = (containerWidth - 2 * margin) / maxSheetWidth;
  const scaleY = (containerHeight - 2 * margin) / maxSheetHeight;
  const scale = Math.min(scaleX, scaleY);

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

  // Variables to hold the total values for all sheets
  let totalArea = 0;
  let totalAreaUsed = 0;
  let totalRemainingArea = 0;
  uniqueSheets.forEach((sheetData, sheetKey) => {
    const sheetName = sheetData.panels[0].sheetGroup;
    const sheetPanels = sheetData.panels;
    const sheetCount = sheetData.count;

    const sheetWidth = sheetPanels[0].sheetWidth;
    const sheetHeight = sheetPanels[0].sheetLength;

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

    // Container SVG with light yellow background
    svgString += `<svg width="${containerWidth}" height="${
      containerHeight + 20
    }" xmlns="http://www.w3.org/2000/svg" style="background-color: lightyellow; margin: ${margin}px; position: relative;">`;

    // Inner sheet SVG with white background, without border
    svgString += `<svg width="${sheetWidth * scale}" height="${
      sheetHeight * scale
    }" x="${margin}" y="${margin}" style="background-color: white;">`;

    // Add a black border rectangle inside the sheet SVG
    svgString += `<rect x="0" y="0" width="${sheetWidth * scale}" height="${
      sheetHeight * scale
    }" fill="none" stroke="black" stroke-width="1"/>`;

    sheetPanels.forEach((panel) => {
      const panelLabels = document.getElementById("panelLabels").checked
        ? "on"
        : "off";
      const cutThickness = document.getElementById("cutThickness").value;

      const scaledX = panel.x * scale;
      const scaledY = panel.y * scale;
      const scaledWidth = panel.width * scale;
      const scaledLength = panel.length * scale;

      if (panelLabels === "on") {
        svgString += `<rect x="${scaledX}" y="${scaledY}" width="${scaledWidth}" height="${scaledLength}" fill="${
          panel.panelColor
        }" stroke="black" stroke-width="${cutThickness}" class="panel-rect">
        <title>${panel.panelName}: ${panel.length} x ${
          panel.width
        }, Rotation: ${
          panel.rotation
        }, Panel (XY): ${scaledX} ${scaledY}</title>
      </rect>
      <text x="${scaledX + 5}" y="${scaledY + 20}" fill="black">${
          panel.panelName
        }</text>`;
      } else {
        svgString += `<rect x="${scaledX}" y="${scaledY}" width="${scaledWidth}" height="${scaledLength}" fill="${panel.panelColor}" stroke="black" stroke-width="${cutThickness}" class="panel-rect">
        <title>${panel.panelName}: ${panel.length} x ${panel.width}, Rotation: ${panel.rotation}, Panel (XY): ${scaledX} ${scaledY}</title>
      </rect>`;
      }
    });

    svgString += `</svg>`; // Closing sheet SVG

    // Add the sheet count label outside the inner sheet SVG, at the bottom
    svgString += `<text x="${margin}" y="${
      sheetHeight * scale + margin + 20
    }" fill="black" font-size="16px">${sheetName}: x${sheetCount} </text>`;

    svgString += `</svg>`; // Closing container SVG
  });

  // Calculate overall percentages
  const totalUsedAreaPercentage = (totalAreaUsed / totalArea) * 100;
  const totalWastedAreaPercentage = 100 - totalUsedAreaPercentage;
  const percentTotalArea = totalUsedAreaPercentage + totalWastedAreaPercentage;

  // Update the DOM with the calculated values
  // document.getElementById("totalArea").value = totalArea;
  // document.getElementById("percentTotalArea").value = percentTotalArea;
  // document.getElementById("totalUsedArea").value = totalAreaUsed;
  // document.getElementById("totalUsedAreaPercentage").value =
  //   totalUsedAreaPercentage.toFixed(1);
  // document.getElementById("totalWastedArea").value = totalRemainingArea;
  // document.getElementById("totalWastedAreaPercentage").value =
  //   totalWastedAreaPercentage.toFixed(1);

  document.getElementById("svgContainer").innerHTML = svgString;

  const singleSheet = document.getElementById("singleSheet").checked
    ? "on"
    : "off";

  return {
    totalArea,
    percentTotalArea,
    totalAreaUsed,
    totalUsedAreaPercentage: totalUsedAreaPercentage.toFixed(2),
    totalRemainingArea,
    totalWastedAreaPercentage: totalWastedAreaPercentage.toFixed(2),
    totalCutDetails,
    totalCutLength,
    cutThickness,
  };
}

// document
//   .getElementById("panelLabels")
//   .addEventListener("click", displayPanelAndSheetInfo);
