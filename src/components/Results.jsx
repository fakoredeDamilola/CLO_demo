import React, {useState} from "react";
import "../style/style.css";

const Results = (props) => {
  const {stockWidth, stockSheetStyle, panelLabels, panelDivs, panelText} =
    props;
  const [zoom, setZoom] = useState(0.5); // Initial zoom set to 0.5 (50% size)

  const panelMargin = 10;
  return (
    <div>
      {/* <div className="zoom-controls">
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div> */}

      <div className="results panelContainer">
        <div
          id="stockSheet"
          className="stock-sheet"
          style={{...stockSheetStyle, backgroundColor: "#D3D3D3"}}
        >
          <div className="dimension-label" style={{width: stockWidth + "px"}}>
            {stockWidth}
          </div>

          {panelDivs.map((panelDiv, index) => {
            const panelLabel = panelLabels[index];
            return (
              <div
                className="panelDiv panel"
                key={index}
                style={panelDiv.style}
              >
                <div
                  className="panelLabel"
                  key={panelLabel.id}
                  style={{
                    ...panelLabel.style,
                    marginLeft: panelMargin + "px",
                    marginTop: panelMargin + "px",
                  }}
                >
                  {panelLabel.width}{" "}
                  <span className="dimension-arrow">&rarr;</span>
                  {panelLabel.height}{" "}
                  <span className="dimension-arrow">&darr;</span>
                  <h3 className="panelText" style={{color: "black"}}>
                    {panelText && panelLabel.panelText}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Results;
