import React, { useEffect } from "react";
import jsPDF from "jspdf";
import { formatToTableData } from "../utils/func";

const GeneratePDF = ({
  globalSheetStatistics,
  svgSheetArray,
  panelRowData,
  additionalFeatures,
  stockRowData,
  notPlacedPanels,
  generatePDFData,
  pdfFileName,
  pdfHeaderText,
}) => {
  useEffect(() => {
    if (generatePDFData) generatePDF();
  }, [generatePDFData]);
  const generatePDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const lineHeight = 10;
    const colWidth = (pageWidth - 2 * margin) / 2;

    let yOffset = 20;
    const addHeaderAndFooter = (doc, pageNumber, totalPages) => {
      // Header
      doc.setFontSize(12);
      doc.text(pdfHeaderText, margin, 10);
      doc.line(margin, 12, pageWidth - margin, 12);
      // Footer
      doc.setFontSize(10);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      doc.text(`Page ${pageNumber} of ${totalPages}`, margin, pageHeight - 10);
    };

    const renderColumn = (column, xOffset) => {
      doc.setFontSize(10);
      column.forEach(([key, value], index) => {
        // Format the key and value (example: totalAreaUsed: 150)
        let formattedText = `${
          key
            .replace(/([A-Z])/g, " $1")
            .trim()
            .charAt(0)
            .toUpperCase() +
          key
            .replace(/([A-Z])/g, " $1")
            .trim()
            .slice(1)
        }: ${value}`;
        if (key === "panelThickness") {
          formattedText = "Cut/ Blade/ Kerf thickess: " + value;
        }
        // Use doc.splitTextToSize to handle text wrapping
        const splitText = doc.splitTextToSize(formattedText, colWidth - 5);

        doc.text(splitText, xOffset, yOffset + index * lineHeight);
      });
      return column.length * lineHeight;
    };

    const generateGlobalData = (globalSheetStatistics) => {
      const statsEntries = Object.entries(globalSheetStatistics);

      // Divide into two columns: first 5 stats in one column, next 5 in the second
      const half = Math.ceil(statsEntries.length / 2);
      const column1 = statsEntries.slice(0, half);
      const column2 = statsEntries.slice(half);
      const offset1 = renderColumn(column1, margin);
      renderColumn(column2, margin + colWidth);
      yOffset += offset1;
    };

    const tableHeading = (tableTitle, withBackground = false) => {
      const titleHeight = 10; // Height for the title row
      const paddingY = 2; // Padding for the background height around the text
      const textX = margin; // X position for the text
      const textY = yOffset + titleHeight; // Y position for the text

      // Check if background should be applied
      if (withBackground) {
        doc.setFillColor(139, 0, 0);

        // Draw the background rectangle for the full width
        doc.rect(
          margin,
          yOffset - paddingY,
          pageWidth - 2 * margin,
          titleHeight + 2 * paddingY,
          "F"
        ); // Full page width background
        doc.setTextColor(255, 255, 255); // White text
      }
      doc.setFontSize(13);
      doc.text(tableTitle, textX, textY);

      yOffset += titleHeight + 5; // Additional space after the title
      doc.setTextColor(0, 0, 0);
    };

    const drawTable = (tableTitle, dataForTable, features, type) => {
      tableHeading(tableTitle, type === "error" ? true : false);

      const tableX = margin;
      const tableY = yOffset + 10; // Some space after the global data
      const rowHeight = 10;
      let colIndex = 0;

      const considerGrainDirection = features.considerGrainDirection ?? false;
      const addMaterialToSheets = features.addMaterialToSheets ?? false;
      const panelLabel = features.panelLabel ?? false;

      // Dynamically set column widths based on the number of fields
      const baseCols = 3; // Length, Width, Quantity
      const extraCols =
        (panelLabel ? 1 : 0) +
        (addMaterialToSheets ? 1 : 0) +
        (considerGrainDirection ? 1 : 0);
      const totalCols = baseCols + extraCols;
      const colWidth = (pageWidth - 2 * margin) / totalCols;

      // Draw headers
      doc.setFontSize(10);
      doc.text("Length", tableX + colWidth * colIndex++, tableY);
      doc.text("Width", tableX + colWidth * colIndex++, tableY);
      doc.text("Quantity", tableX + colWidth * colIndex++, tableY);

      // Conditionally add headers for extra columns
      if (panelLabel) {
        doc.text("Label", tableX + colWidth * colIndex++, tableY);
      }
      if (addMaterialToSheets) {
        doc.text("Material", tableX + colWidth * colIndex++, tableY);
      }
      if (considerGrainDirection) {
        doc.text("Grain Direction", tableX + colWidth * colIndex++, tableY);
      }

      // Draw lines for the table header
      doc.line(tableX, tableY + 2, pageWidth - margin, tableY + 2); // Line below header

      // Adding sample data (you can replace this with dynamic data if needed)
      const tableData = dataForTable.map((row) => ({
        length: row.length,
        width: row.width,
        quantity: row.quantity,
        label: row.label,
        material: row.material,
        grainDirection: row.grainDirection,
      }));

      // Draw rows with data
      tableData.forEach((row, index) => {
        const rowY = tableY + (index + 1) * rowHeight;
        colIndex = 0;

        doc.text(row.length, tableX + colWidth * colIndex++, rowY);
        doc.text(row.width, tableX + colWidth * colIndex++, rowY);
        doc.text(row.quantity, tableX + colWidth * colIndex++, rowY);

        // Conditionally add extra columns' data
        if (panelLabel) {
          doc.text(row.label || "", tableX + colWidth * colIndex++, rowY);
        }
        if (addMaterialToSheets) {
          doc.text(row.material || "", tableX + colWidth * colIndex++, rowY);
        }
        if (considerGrainDirection) {
          doc.text(
            row.grainDirection || "",
            tableX + colWidth * colIndex++,
            rowY
          );
        }

        // Draw horizontal line after each row
        doc.line(tableX, rowY + 2, pageWidth - margin, rowY + 2);
      });

      yOffset = tableY + (tableData.length + 1) * rowHeight; // Adjust yOffset after the table
    };
    const drawTableForStockSheet = (dataForTable) => {
      const actualTableWidth = pageWidth / 2;
      const tableX = margin;
      const tableY = yOffset;
      const rowHeight = 6;
      let colIndex = 0;

      const totalCols = 2;
      const colWidth = (pageWidth / 2 - 2 * margin) / totalCols;

      // Draw headers
      doc.setFontSize(10);
      doc.text("Name", tableX + colWidth * colIndex++, tableY);
      doc.text("Value", tableX + colWidth * colIndex++, tableY);

      // Draw lines for the table header
      doc.line(tableX, tableY + 2, actualTableWidth - margin, tableY + 2);
      console.log({ dataForTable }, Object.entries(dataForTable));
      doc.setFontSize(8);
      Object.entries(dataForTable).forEach(([key, value], index) => {
        let formattedText = `${
          key
            .replace(/([A-Z])/g, " $1")
            .trim()
            .charAt(0)
            .toUpperCase() +
          key
            .replace(/([A-Z])/g, " $1")
            .trim()
            .slice(1)
        }`;
        const rowY = tableY + (index + 1) * rowHeight;
        colIndex = 0;

        doc.text(formattedText, tableX + colWidth * colIndex++, rowY);
        doc.text(`${value}`, tableX + colWidth * colIndex++, rowY);

        // Draw horizontal line after each row except last row
        if (index < Object.entries(dataForTable).length - 1) {
          doc.line(tableX, rowY + 2, actualTableWidth - margin, rowY + 2);
        }
      });

      yOffset = tableY + (Object.entries(dataForTable).length + 1) * rowHeight; // Adjust yOffset after the table
    };

    const svgToImage = (svgString, width, height) => {
      return new Promise((resolve) => {
        const svgBlob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        console.log({ width, height, wIMG: img.width, hIMG: img.height });
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const context = canvas.getContext("2d");
          context.drawImage(img, 0, 0);
          URL.revokeObjectURL(url); // Clean up the object URL
          resolve(canvas.toDataURL("image/png")); // Resolve the image as PNG
        };
        img.src = url;
      });
    };

    const getSvgDimensions = (svgString) => {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
      const svgElement = svgDoc.documentElement;
      const width = svgElement.getAttribute("width");
      const height = svgElement.getAttribute("height");
      return { width: parseFloat(width), height: parseFloat(height) };
    };

    const addImageStocksheetToPDF = async (svgSheetDetails) => {
      for (const { newSVGSheet: svg, sheetInfo } of svgSheetDetails) {
        console.log({ svg, sheetInfo });
        const { width: svgWidth, height: svgHeight } = getSvgDimensions(svg);
        const imgData = await svgToImage(svg, svgWidth, svgHeight);

        let imgWidth = pageWidth - 20;
        let imgHeight = (svgHeight / svgWidth) * imgWidth;

        if (yOffset + imgHeight + 20 > pageHeight) {
          doc.addPage();
          yOffset = 20;
        }

        doc.addImage(imgData, "PNG", 10, yOffset + 10, imgWidth, imgHeight);
        yOffset += imgHeight + 20;
        drawTableForStockSheet(sheetInfo);
      }
    };
    doc.setFontSize(10);
    generateGlobalData(globalSheetStatistics);
    drawTable("Panel Details", panelRowData, additionalFeatures);
    drawTable("Stocksheet Details", stockRowData, additionalFeatures);
    if (notPlacedPanels.length > 0) {
      const formattedNotPlacedPanelData = formatToTableData(notPlacedPanels);

      drawTable(
        "Not Placed Panel Details",
        formattedNotPlacedPanelData,
        {
          panelLabel: true,
        },
        "error"
      );
    }

    await addImageStocksheetToPDF(svgSheetArray);

    // Add headers and footers to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);
      addHeaderAndFooter(doc, page, totalPages);
    }

    doc.save(pdfFileName + ".pdf");
    // const pdfBlob = doc.output("blob");
    // const pdfUrl = URL.createObjectURL(pdfBlob);
    // window.open(pdfUrl); // Open in a new tab
  };

  return <></>;
};

export default GeneratePDF;
