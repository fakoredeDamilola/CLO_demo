import React, {useState, useRef} from "react";
import "../style/style.css";
import {TransformWrapper, TransformComponent} from "react-zoom-pan-pinch";

const Results = (props) => {
  const {stockWidth, stockSheetStyle, panelLabels, panelDivs, panelText} =
    props;
  const containerRef = useRef(null);

  return (
    <div
      // ref={containerRef}
      style={{
        width: "300px",
        height: "300px",
        // , border: "1px solid black"
      }}
    >
      <TransformWrapper
        initialPositionX={200}
        initialPositionY={100}
        maxScale={2} // Adjust the maximum scale as needed
        minScale={0.05}
        initialScale={0.1}
      >
        {({zoomIn, zoomOut, resetTransform, ...rest}) => (
          <React.Fragment>
            <TransformComponent>
              <div
                style={{width: "100%", height: "100%", background: "lightblue"}}
              >
                <div
                  className="results panelContainer"
                  // style={{cursor: rest.isDragging ? "grabbing" : "grab"}}
                >
                  <div
                    id="stockSheet"
                    className="stock-sheet"
                    style={{...stockSheetStyle, backgroundColor: "#D3D3D3"}}
                  >
                    <div
                      className="dimension-label"
                      style={{width: stockWidth + "px"}}
                    >
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
                              background: "red",
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
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    </div>
  );
};

export default Results;
