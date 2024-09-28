function loadCalculation() {
  const savedData = localStorage.getItem("savedCalculation");
  if (savedData) {
    calculationData = JSON.parse(savedData);
    alert("Calculation loaded successfully.");
    // Populate the form with loaded data
    // Shape and Material
    document.getElementById("shape").value = getKeyByValue(
      document.getElementById("shape"),
      calculationData.shape
    );
    displayDimensionInputs();
    document.getElementById("material").value = getKeyByValue(
      document.getElementById("material"),
      calculationData.material
    );
    toggleCustomDensity();

    // Dimensions
    for (let key in calculationData.dimensions) {
      const input = document.getElementById(key);
      if (input) {
        input.value = calculationData.dimensions[key] * 1000; // Convert meters back to mm for inputs
      }
    }

    // Quantity
    document.getElementById("quantity").value = calculationData.quantity;

    // Recalculate and display results
    calculateWeight();

    // Cost Data
    if (calculationData.costPerKg) {
      document.getElementById("costPerKg").value = calculationData.costPerKg;
      document.getElementById("transportCost").value =
        calculationData.transportCost;
      document.getElementById("miscCost").value = calculationData.miscCost;
      calculateCost();
    }
  } else {
    alert("No saved calculation found.");
  }
}

export { loadCalculation };
