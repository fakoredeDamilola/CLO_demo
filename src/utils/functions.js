export function optimizePanels(
  rows,
  stockRows,
  panelLabel,
  panelThickness,
  unitSelect
) {
  const panelData = [];
  const panelGroupColors = {};
  let propertyObject = {};
  let panelInfo = "Panel Information:<br>";
  let sheetInfo = "Sheet Information:<br>";
  let detailInfo = "Detail Information:<br>-------<br>";
  rows.forEach((row, index) => {
    const name = row.label;

    if (!panelGroupColors[name]) {
      panelGroupColors[name] = getRandomColor();
    }

    const length = parseInt(row.height);
    const width = parseInt(row.width);
    const quantity = parseInt(row.quantity);
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
        color: panelGroupColors[name],
      });
    }
    // }
  });

  const sheetData = [];
  stockRows.forEach((row) => {
    const name = row.label;
    const length = row.height;
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
  });

  function bestFitDecreasing(panels, sheets) {
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

  let totalCuts = 0;

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

  panelData.forEach((panel) => {
    if (panel.placed === true) {
      totalCuts++;
    }

    panelInfo += `pid: ${panel.pid} panel: ${panel.panel} - Length: ${
      panel.length
    }, Width: ${panel.width}, Placed: ${panel.placed ? "true" : "false"}<br>`;
  });

  let totalSheetWidth = 0;
  let totalSheetLength = 0;

  sheetData.forEach((sheet) => {
    totalSheetWidth += parseInt(sheet.width);
    totalSheetLength += parseInt(sheet.length);
  });

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
  const margin = 10;

  for (const sheetName in panelsBySheet) {
    const sheetPanels = panelsBySheet[sheetName];

    // Ensure sheet dimensions are used accurately
    const sheetWidth = sheetPanels[0].sheetLength;
    const sheetHeight = sheetPanels[0].sheetWidth;

    svgString += `<svg width="${sheetHeight}" height="${sheetWidth}" xmlns="http://www.w3.org/2000/svg" style="background-color: ${getRandomColor()}; margin: ${margin}px;" style="background-color: #f0f0f0;" className="svg"> `;

    sheetPanels.forEach((panel) => {
      TAused = panel.areaUsed;
      remArea = panel.remainingArea;
      let TA = TAused + remArea;
      let percent = (TAused / TA) * 100;

      document.getElementById("totalArea").value =
        TA + " " + unitSelect + "\u00B2";
      document.getElementById("totalUsedArea").value =
        TAused + " " + unitSelect + "\u00B2";
      document.getElementById("totalUsedAreaPercentage").value =
        percent.toFixed(1) + " %";
      document.getElementById("totalWastedArea").value =
        remArea + " " + unitSelect + "\u00B2";
      document.getElementById("totalWastedAreaPercentage").value =
        (100 - percent).toFixed(1) + " %";

      const rectWidth = panel.width;
      const rectHeight = panel.length;
      const textWidth = 80; // Maximum width for the text, adjust as needed
      const textX = panel.x + panel.width / 2; // Calculate x position for text
      const textY = panel.y + panel.length / 2; // Calculate y position for text
      if (panelLabel) {
        svgString += `<rect x="${panel.x}" y="${panel.y}" width="${
          panel.width
        }" height="${panel.length}" fill="${
          panel.panelColor
        }" stroke="black" class="panel-rect">
          <title>${panel.panelName}: ${panel.length}${unitSelect} x ${
          panel.width
        }${unitSelect}, Panel (XY): ${panel.x} ${panel.y} </title>
          </rect>
  
          <text x="${textX}" y="${textY}" fill="black" text-anchor="middle" alignment-baseline="middle" dominant-baseline="middle" style="max-width: ${textWidth}px;">${
          panel.panelGroup
        }</text>
  
          <text x="${panel.x + rectHeight / 2}" y="${
          panel.y - 10
        }" fill="black" transform="rotate(90 ${panel.x} ${panel.y})">${
          panel.length
        }</text>
  
          <text x="${panel.x + rectWidth / 2}" y="${
          panel.y + 20
        }" fill="black" text-anchor="start">${panel.width}</text>`;
      } else {
        svgString += `<rect x="${panel.x}" y="${panel.y}" width="${panel.width}" height="${panel.length}" fill="${panel.panelColor}" stroke="black" class="panel-rect">
        <title>${panel.panelName}: ${panel.length}${unitSelect} x ${panel.width}${unitSelect}, Panel (XY): ${panel.x} ${panel.y}</title>
      </rect>`;
      }
    });

    svgString += `</svg>`;
  }
  document.getElementById("svgContainer").innerHTML = svgString;
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
