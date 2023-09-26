import React from 'react';

const PlacementDetails = ({ placementDetails }) => {
  return (
    <div>
      {placementDetails.map((placement, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h2>Stock Sheet</h2>
          <div>
            Width: {placement.stockSheet.width}, Length: {placement.stockSheet.height}
          </div>
          <div style={{ backgroundColor: 'lightgray', width: `${placement.stockSheet.width}px`, height: `${placement.stockSheet.height}px`, position: 'relative' }}>
            {/* Render the stock sheet with its actual dimensions */}
            Stock Sheet
            {placement.panels.map((panel, panelIndex) => (
              <div
                key={panelIndex}
                style={{
                  backgroundColor: panel.color,
                  width: `${panel.width}px`,
                  height: `${panel.height}px`,
                  position: 'absolute',
                  top: `${panel.position.top}px`,
                  left: `${panel.position.left}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Render each panel with its individual dimensions and position */}
                Panel {panelIndex + 1} ({placement.panel.quantity})
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlacementDetails;
