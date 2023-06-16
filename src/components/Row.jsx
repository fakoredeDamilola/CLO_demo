import React, { useState } from "react";

const Row = () => {
  const [values, setValues] = useState({
    length: "",
    quantity: "",
    width: "",
    result: "",
  });

  const handleDataChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const performCutlistOptimization = (
    availableLength,
    availableAmount,
    availableWidth
  ) => {
    // for demo purposes the following estimations have been made
    const requiredLength = 1;
    const requiredAmount = 1;
    const requiredWidth = 1;

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
    const { length, quantity, width } = values;
    const optimizationResult = performCutlistOptimization(
      parseInt(length),
      parseInt(quantity),
      parseInt(width)
    );

    if (typeof optimizationResult === "object") {
      const {
        totalYield,
        usedStocksTotalArea,
        totalPanelsArea,
        totalRequiredPanels,
      } = optimizationResult;

      setValues((prevValues) => ({
        ...prevValues,
        result: `Total Yield: ${totalYield}, Used Stocks Total Area: ${usedStocksTotalArea}, Total Panels Area: ${totalPanelsArea}, Total Required Panels: ${totalRequiredPanels}`,
      }));
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        result: optimizationResult,
      }));
    }
  };

  const handleDelete = () => {
    onDelete(); // Call the parent component's onDelete function
  };

  return (
    <tr>
      <td>
        <input
          type="number"
          name="length"
          value={values.length}
          onChange={handleDataChange}
        />
      </td>
      <td>
        <input
          type="number"
          name="width"
          value={values.width}
          onChange={handleDataChange}
        />
      </td>
      <td>
        <input
          type="number"
          name="quantity"
          value={values.quantity}
          onChange={handleDataChange}
        />
      </td>
      <td>{values.result}</td>
      <td>
        <button onClick={handleOptimization}>Optimize</button>
        <button onClick={handleDelete}>Delete</button> {/* Add Delete button */}
      </td>
    </tr>
  );
};

export default Row;
