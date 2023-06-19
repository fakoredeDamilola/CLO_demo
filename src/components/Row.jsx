import React, {useState} from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Row = ({onDelete}) => {
  const [values, setValues] = useState({
    length: "",
    quantity: "",
    width: "",
    result: "",
  });

  const handleDataChange = (event) => {
    const {name, value} = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const [showPopup, setShowPopup] = useState(false);

  const handleShowPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
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
    const {length, quantity, width} = values;
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

    handleShowPopup();
  };

  const handleDelete = () => {
    onDelete(); // Call the parent component's onDelete function
  };

  // show and hide increment and decrement buttons
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  // JavaScript snippet to hide increment and decrement buttons in Firefox
  if (navigator.userAgent.toLowerCase().indexOf("firefox") > -1) {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach((input) => {
      input.addEventListener("DOMAttrModified", function (e) {
        if (e.attrName === "value") {
          this.style.marginRight = "0"; // Reset margin to hide the buttons
          this.style.marginRight = -this.offsetWidth + "px"; // Hide buttons by moving them outside the input field
        }
      });
    });
  }

  return (
    <tr>
      <td>
        <input
          type="number"
          name="length"
          value={values.length}
          onChange={handleDataChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </td>
      <td>
        <input
          type="number"
          name="width"
          value={values.width}
          onChange={handleDataChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </td>
      <td>
        <input
          type="number"
          name="quantity"
          value={values.quantity}
          onChange={handleDataChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </td>
      {/* <td>{values.result}</td> */}
      <td>
        <button onClick={handleOptimization}>Optimize</button>
        <button onClick={handleDelete}>Delete</button> {/* Add Delete button */}
      </td>
      <Modal show={showPopup} onHide={handleClosePopup}>
        <Modal.Header closeButton>
          <Modal.Title>Optimization Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display the optimization result here */}
          {values.result}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePopup}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      ;
    </tr>
  );
};

export default Row;
