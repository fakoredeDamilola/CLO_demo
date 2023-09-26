import React from 'react'

const Results = (props) => {
    const {stockWidth,stockSheetStyle,panelLabels,panelDivs} = props
  return (
    <div className="results panelContainer">
    <div id="stockSheet" className="stock-sheet" style={stockSheetStyle}>
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
              style={panelLabel.style}
            >
              {panelLabel.width}{" "}
              <span className="dimension-arrow">&rarr;</span>
              {panelLabel.height}{" "}
              <span className="dimension-arrow">&darr;</span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
  )
}

export default Results