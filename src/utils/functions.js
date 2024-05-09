export function optimizePanels(stockSheets, panelData, panelMargin = 0) {
  const allResults = [];
  let stockSheetStyle;
  for (const stockSheet of stockSheets) {
    const results = [];
    let totalCutLength = 0;
    let totalUsedArea = 0;
    const parentPanel = [];
    const parentLabel = [];
    stockSheetStyle = {
      backgroundColor: getColorForPanel(stockSheet.width, stockSheet.height),
      width: `${stockSheet.width}px`,
      height: `${stockSheet.height}px`,
    };

    let stockLength = parseInt(stockSheet.width);
    let stockWidth = parseInt(stockSheet.height);

    const matrix = Array.from({ length: stockLength + 1 }, () =>
      Array(stockWidth + 1).fill(false)
    );

    panelData.sort((a, b) => b.width * b.height - a.width * b.height);

    function canFit(row, col, panelWidth, panelHeight) {
      const margin = parseInt(panelMargin) ?? 0;
      for (let r = row; r < row + panelHeight; r++) {
        for (let c = col; c < col + panelWidth + margin; c++) {
          if (matrix[r][c]) {
            return false;
          }
        }
      }
      return true;
    }

    function placePanel(
      row,
      col,
      panelWidth,
      panelHeight,
      panelText,
      color,
      i
    ) {
      const margin = panelMargin ? parseInt(panelMargin) : 0;
      if (col > 0) {
        col += margin; // Add margin to the left for panels that are not the first in a row
      }

      if (col + panelWidth + margin <= stockSheet.width) {
        // If the panel with margin fits within the sheet width
        for (let r = row; r < row + panelHeight; r++) {
          for (let c = col; c < col + panelWidth; c++) {
            matrix[r][c] = true;
          }
        }
      } else {
        // If the panel with margin overflows the sheet width, move to the next line
        row += panelHeight + margin; // Move to the next line with margin
        col = 0; // Reset the column to the beginning
        for (let r = row; r < row + panelHeight; r++) {
          for (let c = col; c < col + panelWidth; c++) {
            matrix[r][c] = true;
          }
        }
      }

      const panelDiv = {
        id: parseInt(Math.random() * row),
        className: "panel",
        style: {
          width: panelWidth + "px",
          height: panelHeight + "px",
          left: col + "px",
          top: row + "px",
          backgroundColor: color,
        },
      };

      const panelLabel = {
        id: parseInt(Math.random() * row),
        className: "dimension-label",
        style: {
          width: panelWidth + "px",
          height: panelHeight + "px",
          left: col + "px",
          top: row + "px",
        },
        panelText,
        width: panelWidth,
        height: panelHeight,
      };

      const area = (panelWidth + margin) * (panelHeight + margin); // Account for margin in the area
      totalUsedArea += area;
      parentPanel.push(panelDiv);
      parentLabel.push(panelLabel);
      totalCutLength += panelWidth + panelHeight + margin; // Account for panel thickness and margin
    }

    // Rest of the code remains the same, but you need to replace stockLength and stockWidth
    // with stockSheet.width and stockSheet.height in relevant places.

    // ... (previous code)

    for (const panel of panelData) {
      const panelWidth = parseInt(panel.width);
      const panelHeight = parseInt(panel.height);
      const panelQuantity = parseInt(panel.quantity);
      const panelText = panel.label;
      const color = getColorForPanel(panelWidth, panelHeight);

      for (let i = 0; i < panelQuantity; i++) {
        let placed = false;

        for (let row = 0; row <= stockSheet.width - panelHeight; row++) {
          for (let col = 0; col <= stockSheet.height - panelWidth; col++) {
            if (canFit(row, col, panelWidth, panelHeight)) {
              placePanel(
                row,
                col,
                panelWidth,
                panelHeight,
                panelText,
                color,
                i
              );
              placed = true;
              break;
            }
          }
          if (placed) break;
        }

        if (!placed) {
          // Handle cases where the panel couldn't be placed on the current stock sheet.
          // You may want to log or handle this case as needed.

          break;
        }
      }
    }

    // Calculate and store the results for the current stock sheet.
    const totalWasteArea = stockSheet.width * stockSheet.height - totalUsedArea;
    const panelsTotal = panelData.reduce(
      (acc, panel) => acc + parseInt(panel.quantity),
      0
    );

    results.push({
      parentPanel,
      parentLabel,
      totalCutLength,
      totalWasteArea,
      panelsTotal,
      stockSheetStyle,
    });

    allResults.push(results);
  }
  return allResults;
}

function getColorForPanel(panelWidth, panelHeight) {
  const sizeString = `${panelWidth}x${panelHeight}`;

  const sizeToColorMap = new Map();
  if (!sizeToColorMap.has(sizeString)) {
    // Generate a random color for a new size and store it in the map
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    //   + "13";
    sizeToColorMap.set(sizeString, randomColor);
  }
  return sizeToColorMap.get(sizeString);
}
