import React from "react";
import jsPDF from "jspdf";

const GeneratePDF = ({ globalSheetStatistics, svgString }) => {
  const generatePDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    const lineHeight = 10;
    const colWidth = (pageWidth - 2 * margin) / 2;

    let currentPage = 1;
    let yOffset = 20; // Initial offset (below header)

    const addHeaderAndFooter = (doc, pageNumber, totalPages) => {
      // Header
      doc.setFontSize(12);
      doc.text("Cutlist Optimizer Report", margin, 10);
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
        const formattedText = `${
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
        doc.text(formattedText, xOffset, yOffset + index * lineHeight);
      });
      return column.length * lineHeight;
      // yOffset += column.length * lineHeight;
    };

    const generateGlobalData = (globalSheetStatistics) => {
      const statsEntries = Object.entries(globalSheetStatistics);

      // Divide into two columns: first 5 stats in one column, next 5 in the second
      const half = Math.ceil(statsEntries.length / 2);
      const column1 = statsEntries.slice(0, half);
      const column2 = statsEntries.slice(half);
      // return {column1, column2};
      const offset1 = renderColumn(column1, margin);
      renderColumn(column2, margin + colWidth);
      yOffset += offset1;
    };

    // Function to convert SVG string to a PNG using a canvas
    const svgToImage = (svgString) => {
      return new Promise((resolve) => {
        const svgBlob = new Blob([svgString], {
          type: "image/svg+xml;charset=utf-8",
        });
        const url = URL.createObjectURL(svgBlob);
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
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

    const addImageStocksheetToPDF = async (svgStrings) => {
      for (const svg of svgStrings) {
        const imgData = await svgToImage(svg);
        const { width: svgWidth, height: svgHeight } = getSvgDimensions(svg);

        let imgWidth = pageWidth - 20;
        let imgHeight = (svgHeight / svgWidth) * imgWidth;

        // Check if there's enough space left on the current page
        if (yOffset + imgHeight + 20 > pageHeight) {
          doc.addPage(); // Add new page if necessary
          yOffset = 20; // Reset yOffset for the new page
        }

        // Add the image at the current yOffset
        doc.addImage(imgData, "PNG", 10, yOffset + 10, imgWidth, imgHeight);
        yOffset += imgHeight + 20; // Update yOffset for the next image
      }
    };

    const splitSVGs = svgString.split(/(?=<svg)/); // Regex to split at each <svg tag
    console.log({ splitSVGs });
    generateGlobalData(globalSheetStatistics);
    // Add all SVGs to the PDF
    await addImageStocksheetToPDF(splitSVGs);

    // Add headers and footers to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let page = 1; page <= totalPages; page++) {
      doc.setPage(page);
      addHeaderAndFooter(doc, page, totalPages);
    }

    // doc.save("cutlist_optimizer.pdf");
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl); // Open in a new tab
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "20px 0",
      }}
    >
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          cursor: "pointer",
          borderRadius: "4px",
          fontSize: "16px",
          fontWeight: "bold",
          marginRight: "10px",
          border: "none",
          width: "300px",
        }}
        onClick={generatePDF}
      >
        Download PDF
      </button>
    </div>
  );
};

export default GeneratePDF;
