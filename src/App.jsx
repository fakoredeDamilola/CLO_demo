import { useState } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import Header from "./components/Header";
import Worksheet from "./components/Worksheet";
// import Panelsheet from "./components/Panelsheet";
// import Stocksheet from "./components/Stocksheet";

function App() {
  const [stockData, setStockData] = useState([]);
  const [panelData, setPanelData] = useState([]);

  const handleStockDataChange = (data) => {
    setStockData(data);
  };

  const handlePanelDataChange = (data) => {
    setPanelData(data);
  };

  const performCutlistOptimization = (stockData, panelData) => {
    const requiredLength = stockData.length;
    const requiredAmount = stockData.amount;
    const requiredWidth = stockData.width;

    const availableLength = panelData.length;
    const availableAmount = panelData.amount;
    const availableWidth = panelData.width;

    const availableArea = availableLength * availableAmount * availableWidth;
    const requiredArea = requiredLength * requiredAmount * requiredWidth;

    if (
      availableLength >= requiredLength &&
      availableAmount >= requiredAmount &&
      availableWidth >= requiredWidth
    ) {
      const usedStocksTotalArea = requiredArea;
      const totalPanelsArea = availableArea;
      const totalRequiredPanels = Math.ceil(availableArea / requiredArea);

      const totalYield = totalPanelsArea - totalRequiredPanels * requiredArea;

      return {
        totalYield,
        usedStocksTotalArea,
        totalPanelsArea,
        totalRequiredPanels,
      };
    } else {
      return "Insufficient stock";
    }
  };

  const handleOptimization = () => {
    // You can access and utilize the data to perform the necessary calculations
    console.log("Stock Data:", stockData);
    console.log("Panel Data:", panelData);
    // Perform the optimization computation using stockData and panelData
    const optimizationResult = performCutlistOptimization(stockData, panelData);

    console.log("Optimization Result:", optimizationResult);
  };
  return (
    <>
      <Header />
      <Worksheet
        title={"Stock"}
        onDataChange={handleStockDataChange}
        onOptimization={handleOptimization}
      />
      <Worksheet
        title={"Panel"}
        onDataChange={handlePanelDataChange}
        onOptimization={handleOptimization}
      />
    </>
  );
}

export default App;
