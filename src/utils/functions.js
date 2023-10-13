export function optimizePanels(stockLength, stockWidth, rows, panelMargin = 0) {
  const results = [];
  let totalCutLength = 0;
  let totalUsedArea = 0;
  const parentPanel = [];
  const parentLabel = [];

  stockLength = parseInt(stockLength);
  stockWidth = parseInt(stockWidth);

  const matrix = Array.from({length: stockLength + 1}, () =>
    Array(stockWidth + 1).fill(false)
  );

  rows.sort((a, b) => b.width * b.height - a.width * a.height);

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
  // function placePanel(row, col, panelWidth, panelHeight, panelText, color, i) {
  //   const margin = panelMargin ? parseInt(panelMargin) * i : 0;
  //   console.log({margin, col});
  //   for (let r = row; r < row + panelHeight; r++) {
  //     for (let c = col; c < col + panelWidth; c++) {
  //       matrix[r][c] = true;
  //     }
  //   }

  //   const panelDiv = {
  //     id: parseInt(Math.random() * row),
  //     className: "panel",
  //     style: {
  //       width: panelWidth + "px",
  //       height: panelHeight + "px",
  //       left: col + margin + "px",
  //       top: row + "px",
  //       backgroundColor: color,
  //     },
  //   };

  //   const panelLabel = {
  //     id: parseInt(Math.random() * row),
  //     className: "dimension-label",
  //     style: {
  //       width: panelWidth + "px",
  //       height: panelHeight + "px",
  //       left: col + "px",
  //       top: row + "px",
  //     },
  //     panelText,
  //     width: panelWidth,
  //     height: panelHeight,
  //   };

  //   const area = panelWidth * panelHeight;
  //   totalUsedArea += area;
  //   parentPanel.push(panelDiv);
  //   parentLabel.push(panelLabel);
  //   const mar = panelMargin ? parseInt(panelMargin) * 2 : 0;
  //   totalCutLength += panelWidth + panelHeight + mar; // Account for panel thickness
  // }

  function placePanel(row, col, panelWidth, panelHeight, panelText, color, i) {
    const margin = panelMargin ? parseInt(panelMargin) : 0; // Parse margin here
    console.log({margin, col});

    if (col > 0) {
      col += margin; // Add margin to the left for panels that are not the first in a row
    }

    if (col + panelWidth + margin <= stockWidth) {
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

  for (const panel of rows) {
    const panelWidth = parseInt(panel.width);
    const panelHeight = parseInt(panel.height);
    const panelQuantity = parseInt(panel.quantity);
    const panelText = panel.label;
    const color = getColorForPanel(panelWidth, panelHeight);

    for (let i = 0; i < panelQuantity; i++) {
      let placed = false;

      for (let row = 0; row <= stockLength - panelHeight; row++) {
        for (let col = 0; col <= stockWidth - panelWidth; col++) {
          if (canFit(row, col, panelWidth, panelHeight)) {
            placePanel(row, col, panelWidth, panelHeight, panelText, color, i);
            placed = true;
            break;
          }
        }
        if (placed) break;
      }

      if (!placed) {
        // setRemainingPanel([...remainingPanel, panel]);
        break;
      }
    }
  }
  const totalWasteArea = stockLength * stockWidth - totalUsedArea;
  const panelsTotal = rows.reduce(
    (acc, panel) => acc + parseInt(panel.quantity),
    0
  );

  results.push({
    parentPanel,
    parentLabel,
    totalCutLength,
    totalWasteArea,
    panelsTotal,
  });
  return results;
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
