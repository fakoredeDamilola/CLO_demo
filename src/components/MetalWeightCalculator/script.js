// Material densities in kg/m³
const materialDensities = {
  steel: 7850,
  aluminum: 2700,
  stainlessSteel: 8000,
  glass: 2500,
  wood: 600,
  copper: 8940,
  brass: 8530,
  bronze: 8800,
  titanium: 4500,
};

// Variables to store calculation results
let calculationData = {};

// Event listeners
document
  .getElementById("shape")
  .addEventListener("change", displayDimensionInputs);
document
  .getElementById("material")
  .addEventListener("change", toggleCustomDensity);
document
  .getElementById("calculateBtn")
  .addEventListener("click", calculateWeight);
document
  .getElementById("calculateCostBtn")
  .addEventListener("click", calculateCost);
document
  .getElementById("downloadExcelBtn")
  .addEventListener("click", downloadAsExcel);
document
  .getElementById("unitToggle")
  .addEventListener("change", displayResults);
document
  .getElementById("saveCalculationBtn")
  .addEventListener("click", saveCalculation);
document
  .getElementById("loadCalculationBtn")
  .addEventListener("click", loadCalculation);
document
  .getElementById("darkModeSwitch")
  .addEventListener("change", toggleDarkMode);

// Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

// Display dimension inputs based on shape
function displayDimensionInputs() {
  const shape = document.getElementById("shape").value;
  const dimensionInputs = document.getElementById("dimension-inputs");
  dimensionInputs.innerHTML = ""; // Clear previous inputs

  let dimensions = [];
  switch (shape) {
    case "plate":
      dimensions = ["Length", "Width", "Thickness"];
      break;
    case "roundPipe":
      dimensions = ["Outer Diameter", "Wall Thickness", "Length"];
      break;
    case "squareBox":
      dimensions = ["Side Length", "Thickness", "Length"];
      break;
    case "rectangularBox":
      dimensions = ["Width", "Height", "Thickness", "Length"];
      break;
    case "roundRod":
      dimensions = ["Diameter", "Length"];
      break;
    case "lAngle":
      dimensions = ["Leg 1 Length", "Leg 2 Length", "Thickness", "Length"];
      break;
    case "tAngle":
      dimensions = ["Flange Width", "Web Height", "Thickness", "Length"];
      break;
    case "iBeam":
      dimensions = [
        "Flange Width",
        "Web Height",
        "Flange Thickness",
        "Web Thickness",
        "Length",
      ];
      break;
    case "cChannel":
      dimensions = ["Flange Width", "Web Height", "Thickness", "Length"];
      break;
    default:
      break;
  }

  dimensions.forEach((dimension) => {
    const group = document.createElement("div");
    group.className = "form-group";

    const label = document.createElement("label");
    label.innerText = `${dimension}:`;
    label.setAttribute("for", dimension.toLowerCase().replace(/ /g, ""));

    const input = document.createElement("input");
    input.type = "number";
    input.id = dimension.toLowerCase().replace(/ /g, "");
    input.name = dimension.toLowerCase().replace(/ /g, "");
    input.min = "0";
    input.step = "any";

    const unitSelect = document.createElement("select");
    unitSelect.id = `${input.id}-unit`;
    ["mm", "cm", "m", "ft/in"].forEach((unit) => {
      const option = document.createElement("option");
      option.value = unit;
      option.innerText = unit;
      unitSelect.appendChild(option);
    });

    group.appendChild(label);
    group.appendChild(input);
    group.appendChild(unitSelect);
    dimensionInputs.appendChild(group);
  });
}

// Toggle custom density input
function toggleCustomDensity() {
  const material = document.getElementById("material").value;
  const customDensityGroup = document.getElementById("custom-density-group");
  if (material === "custom") {
    customDensityGroup.classList.remove("hidden");
  } else {
    customDensityGroup.classList.add("hidden");
  }
}

// Calculate weight and area
function calculateWeight() {
  const errorDiv = document.getElementById("error-message");
  errorDiv.innerText = "";

  // Get material density
  let density;
  const materialSelect = document.getElementById("material");
  const material = materialSelect.value;
  if (material === "custom") {
    density = parseFloat(document.getElementById("customDensity").value);
    if (isNaN(density) || density <= 0) {
      errorDiv.innerText = "Please enter a valid custom density.";
      return;
    }
  } else {
    density = materialDensities[material];
    if (!density) {
      errorDiv.innerText = "Please select a material.";
      return;
    }
  }

  // Get dimensions and convert to meters
  const shapeSelect = document.getElementById("shape");
  const shape = shapeSelect.value;
  if (!shape) {
    errorDiv.innerText = "Please select a shape.";
    return;
  }

  const dimensions = {};
  const dimensionInputs = document.querySelectorAll(
    "#dimension-inputs .form-group"
  );
  for (let group of dimensionInputs) {
    const input = group.querySelector("input");
    const unitSelect = group.querySelector("select");
    let value = parseFloat(input.value);
    const unit = unitSelect.value;

    if (isNaN(value) || value <= 0) {
      errorDiv.innerText = "Please enter valid dimensions.";
      return;
    }

    // Convert to meters
    value = convertToMeters(value, unit);
    dimensions[input.id] = value;
  }

  // Get quantity
  let quantity = parseInt(document.getElementById("quantity").value);
  if (isNaN(quantity) || quantity <= 0) {
    errorDiv.innerText = "Please enter a valid quantity.";
    return;
  }

  // Calculate volume and area based on shape
  let volume = calculateVolume(shape, dimensions);
  let area = calculateArea(shape, dimensions);

  if (volume === null || area === null) {
    errorDiv.innerText =
      "Error calculating volume or area. Please check your inputs.";
    return;
  }

  // Calculate total weight and area
  const totalWeight = volume * density * quantity;
  const totalArea = area * quantity;

  // Store calculation data
  calculationData = {
    shape: shapeSelect.options[shapeSelect.selectedIndex].text,
    material: materialSelect.options[materialSelect.selectedIndex].text,
    density: density,
    dimensions: dimensions,
    quantity: quantity,
    totalArea: totalArea,
    totalWeight: totalWeight,
    cost: null, // Will be updated after cost calculation
  };

  // Display results
  displayResults();

  // Show unit conversion and cost calculation sections
  document.getElementById("unit-conversion").classList.remove("hidden");
  document.getElementById("cost-section").classList.remove("hidden");
}

// Display results with unit conversion
function displayResults() {
  const unitToggle = document.getElementById("unitToggle").value;
  const resultDiv = document.getElementById("result");

  let area = calculationData.totalArea;
  let weight = calculationData.totalWeight;
  let areaUnit = "m²";
  let weightUnit = "kg";

  if (unitToggle === "imperial") {
    // Convert to imperial units
    area *= 10.7639; // Square meters to square feet
    weight *= 2.20462; // Kilograms to pounds
    areaUnit = "ft²";
    weightUnit = "lbs";
  }

  resultDiv.innerHTML = `
        <strong>Total Area:</strong> ${area.toFixed(2)} ${areaUnit}<br>
        <strong>Total Weight:</strong> ${weight.toFixed(2)} ${weightUnit}
    `;
}

// Convert units to meters
function convertToMeters(value, unit) {
  switch (unit) {
    case "mm":
      return value / 1000;
    case "cm":
      return value / 100;
    case "m":
      return value;
    case "ft/in":
      // Assuming the input is in inches when 'ft/in' is selected
      return (value * 25.4) / 1000;
    default:
      return value;
  }
}

// Calculate volume based on shape
function calculateVolume(shape, dims) {
  let volume = null;
  switch (shape) {
    case "plate":
      volume = dims.length * dims.width * dims.thickness;
      break;
    case "roundPipe":
      const outerRadius = dims.outerdiameter / 2;
      const innerRadius = (dims.outerdiameter - 2 * dims.wallthickness) / 2;
      volume =
        Math.PI *
        (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2)) *
        dims.length;
      break;
    case "squareBox":
      const outerArea = Math.pow(dims.sidelength, 2);
      const innerArea = Math.pow(dims.sidelength - 2 * dims.thickness, 2);
      volume = (outerArea - innerArea) * dims.length;
      break;
    case "rectangularBox":
      const outerVol = dims.width * dims.height * dims.length;
      const innerVol =
        (dims.width - 2 * dims.thickness) *
        (dims.height - 2 * dims.thickness) *
        dims.length;
      volume = outerVol - innerVol;
      break;
    case "roundRod":
      const radius = dims.diameter / 2;
      volume = Math.PI * Math.pow(radius, 2) * dims.length;
      break;
    case "lAngle":
      volume =
        (dims.leg1length * dims.thickness +
          (dims.leg2length - dims.thickness) * dims.thickness) *
        dims.length;
      break;
    case "tAngle":
      volume =
        (dims.flangewidth * dims.thickness +
          (dims.webheight - dims.thickness) * dims.thickness) *
        dims.length;
      break;
    case "iBeam":
      const flangeVolume =
        2 * (dims.flangewidth * dims.flangethickness * dims.length);
      const webVolume =
        dims.webthickness *
        (dims.webheight - 2 * dims.flangethickness) *
        dims.length;
      volume = flangeVolume + webVolume;
      break;
    case "cChannel":
      volume =
        (dims.flangewidth * dims.thickness * 2 +
          (dims.webheight - 2 * dims.thickness) * dims.thickness) *
        dims.length;
      break;
    default:
      break;
  }
  return volume;
}

// Calculate area based on shape
function calculateArea(shape, dims) {
  let area = null;
  switch (shape) {
    case "plate":
      area = dims.length * dims.width;
      break;
    case "roundPipe":
      const outerCircumference = Math.PI * dims.outerdiameter;
      area = outerCircumference * dims.length;
      break;
    case "squareBox":
      area = 4 * dims.sidelength * dims.length;
      break;
    case "rectangularBox":
      area = 2 * (dims.width + dims.height) * dims.length;
      break;
    case "roundRod":
      const circumference = 2 * Math.PI * (dims.diameter / 2);
      area = circumference * dims.length;
      break;
    case "lAngle":
      area = (dims.leg1length + dims.leg2length - dims.thickness) * dims.length;
      break;
    case "tAngle":
      area = (dims.flangewidth + dims.webheight - dims.thickness) * dims.length;
      break;
    case "iBeam":
      area =
        (2 * dims.flangewidth + (dims.webheight - 2 * dims.flangethickness)) *
        dims.length;
      break;
    case "cChannel":
      area =
        (2 * dims.flangewidth + (dims.webheight - 2 * dims.thickness)) *
        dims.length;
      break;
    default:
      area = 0;
      break;
  }
  return area;
}

// Calculate cost
function calculateCost() {
  const costPerKg = parseFloat(document.getElementById("costPerKg").value);
  const transportCost = parseFloat(
    document.getElementById("transportCost").value
  );
  const miscCost = parseFloat(document.getElementById("miscCost").value);

  if (isNaN(costPerKg) || costPerKg < 0) {
    alert("Please enter a valid cost per kg.");
    return;
  }

  const totalWeight = calculationData.totalWeight;
  const materialCost = totalWeight * costPerKg;
  const totalCost = materialCost + (transportCost || 0) + (miscCost || 0);

  const costResultDiv = document.getElementById("costResult");
  costResultDiv.innerHTML = `
        <strong>Material Cost:</strong> ${materialCost.toFixed(2)}<br>
        <strong>Transport Cost:</strong> ${transportCost.toFixed(2)}<br>
        <strong>Miscellaneous Cost:</strong> ${miscCost.toFixed(2)}<br>
        <strong>Total Cost:</strong> ${totalCost.toFixed(2)}
    `;

  // Update calculation data
  calculationData.costPerKg = costPerKg;
  calculationData.transportCost = transportCost || 0;
  calculationData.miscCost = miscCost || 0;
  calculationData.materialCost = materialCost;
  calculationData.totalCost = totalCost;

  // Show download and save/load buttons
  document.getElementById("download-section").classList.remove("hidden");
}

// Download results as Excel file
function downloadAsExcel() {
  const wb = XLSX.utils.book_new();
  const ws_data = [
    ["Weight Calculation Results"],
    [],
    ["Shape", calculationData.shape],
    ["Material", calculationData.material],
    ["Density (kg/m³)", calculationData.density],
    ["Quantity", calculationData.quantity],
    [],
    ["Dimensions"],
    ...Object.entries(calculationData.dimensions).map(([key, value]) => [
      key,
      value,
    ]),
    [],
    ["Total Area (m²)", calculationData.totalArea.toFixed(2)],
    ["Total Weight (kg)", calculationData.totalWeight.toFixed(2)],
    [],
    ["Cost Calculation"],
    ["Cost per kg", calculationData.costPerKg],
    ["Material Cost", calculationData.materialCost.toFixed(2)],
    ["Transport Cost", calculationData.transportCost.toFixed(2)],
    ["Miscellaneous Cost", calculationData.miscCost.toFixed(2)],
    ["Total Cost", calculationData.totalCost.toFixed(2)],
    [],
    [
      "Note: While the calculated results are correct to the best of our knowledge, customers are advised to verify the calculations. We do not accept responsibility for any discrepancies.",
    ],
  ];
  const ws = XLSX.utils.aoa_to_sheet(ws_data);
  XLSX.utils.book_append_sheet(wb, ws, "Results");
  XLSX.writeFile(wb, "Weight_Calculation.xlsx");
}

// Save calculation to localStorage
function saveCalculation() {
  localStorage.setItem("savedCalculation", JSON.stringify(calculationData));
  alert("Calculation saved successfully.");
}

// Load calculation from localStorage
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

// Helper function to get the option value by text
function getKeyByValue(selectElement, text) {
  for (let option of selectElement.options) {
    if (option.text === text) {
      return option.value;
    }
  }
  return "";
}
