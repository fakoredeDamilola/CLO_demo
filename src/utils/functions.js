export function optimizePanels(stockSheets, rows, panelMargin = 0) {
  const results = [];
  let totalCutLength = 0;
  let totalUsedArea = 0;
  const parentPanels = [];
  const parentLabel = [];
  const stockSheetStyle = {
    backgroundColor: getColorForPanel(stockSheets.width, stockSheets.height),
    width: `${stockSheets.width}px`,
    height: `${stockSheets.length}px`,
  };

  const stockLength = parseInt(stockSheets.length);
  const stockWidth = parseInt(stockSheets.width);
  const matrix = Array.from({ length: stockLength + 1 }, () =>
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

  function placePanel(
    row,
    col,
    panelWidth,
    panelHeight,
    panelText,
    color,
    i,
    j,
    stockSheetColor
  ) {
    const margin = panelMargin ? parseInt(panelMargin) : 0; // Parse margin here

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
    if (parentPanels.find((p) => p.id === j)) {
      //parentPanel is an array of obj with id and a array of panels
      const index = parentPanels.findIndex((p) => p.id === j);
      console.log({ panelDiv, panelLabel });
      parentPanels[index].parentPanel.push(panelDiv);

      parentPanels[index].parentLabel.push(panelLabel);
    } else {
      parentPanels.push({
        id: j,
        parentPanel: [panelDiv],
        parentLabel: [panelLabel],
        stockSheetColor,
      });
    }
    console.log({ parentPanels });
    // parentPanel.push(panelDiv);
    // parentLabel.push(panelLabel);
    console.log({ parentLabel });
    totalCutLength += panelWidth + panelHeight + margin; // Account for panel thickness and margin
  }

  for (let j = 0; j < stockSheets.quantity; j++) {
    const { width, length } = stockSheets;
    const stockLength = parseInt(length);
    const stockWidth = parseInt(width);
    const stockSheetColor = getColorForPanel(width, length);
    for (const panel of rows) {
      const panelWidth = parseInt(panel.width);
      const panelHeight = parseInt(panel.height);
      const panelQuantity = parseInt(panel.quantity);
      const panelText = panel.label;
      const color = getColorForPanel(panelWidth, panelHeight);
      console.log({ panel }, "ueuehiieiie", panelQuantity);

      for (let i = 0; i < panelQuantity; i++) {
        let placed = false;

        for (let row = 0; row <= stockLength - panelHeight; row++) {
          for (let col = 0; col <= stockWidth - panelWidth; col++) {
            if (canFit(row, col, panelWidth, panelHeight)) {
              placePanel(
                row,
                col,
                panelWidth,
                panelHeight,
                panelText,
                color,
                i,
                j,
                stockSheetColor
              );
              placed = true;
              break;
            }
          }
          if (placed) break;
        }

        if (!placed) {
          // setRemainingPanel([...remainingPanel, panel]);
          console.log({ panel });
          break;
        }
      }
    }
  }
  // for (let j = 0; j < stockSheets.quantity; j++) {
  //   console.log({ stockSheets });
  //   const { width, height } = stockSheets;
  //   const stockLength = parseInt(height);
  //   const stockWidth = parseInt(width);
  //   const stockSheetColor = getColorForPanel(width, height);
  //   console.log({ stockWidth, stockLength });
  //   for (const panel of rows) {
  //     const panelWidth = parseInt(panel.width);
  //     const panelHeight = parseInt(panel.height);
  //     const panelQuantity = parseInt(panel.quantity);
  //     const panelText = panel.label;
  //     const color = getColorForPanel(panelWidth, panelHeight);

  //     for (let i = 0; i < panelQuantity; i++) {
  //       let placed = false;

  //       for (let row = 0; row <= stockLength - panelHeight; row++) {
  //         for (let col = 0; col <= stockWidth - panelWidth; col++) {
  //           if (canFit(row, col, panelWidth, panelHeight)) {
  //             placePanel(
  //               row,
  //               col,
  //               panelWidth,
  //               panelHeight,
  //               panelText,
  //               color,
  //               i
  //             );
  //             placed = true;
  //             break;
  //           }
  //         }
  //         if (placed) break;
  //       }

  //       if (!placed) {
  //         // setRemainingPanel([...remainingPanel, panel]);
  //         console.log({ panel });
  //         break;
  //       }
  //     }
  //   }
  // }
  const totalWasteArea = stockLength * stockWidth - totalUsedArea;
  const panelsTotal = rows.reduce(
    (acc, panel) => acc + parseInt(panel.quantity),
    0
  );

  results.push({
    parentPanels,
    parentLabel,
    totalCutLength,
    totalWasteArea,
    panelsTotal,
    stockSheetStyle,
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
