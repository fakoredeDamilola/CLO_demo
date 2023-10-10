import React from "react";
import {Form, ToggleButton, ToggleButtonGroup} from "react-bootstrap";

const Options = ({
  panelLabel,
  setPanelLabel,
  panelThickness,
  setPanelThickness,
}) => {
  const handleChange = () => {
    setPanelLabel(!panelLabel);
  };
  return (
    <div>
      <p>
        Panel Thickness:{" "}
        <input
          type="number"
          name="panelThickness"
          value={panelThickness}
          onChange={(e) => setPanelThickness(e.target.value)}
          placeholder="Panel Thickness"
          style={{border: "1px solid black"}}
        />
      </p>
      <Form.Check // prettier-ignore
        type="switch"
        height="70px"
        width="70px"
        style={{margin: "20px 0"}}
        id="custom-switch"
        label="Panel Label"
        checked={panelLabel}
        value={panelLabel}
        name="panelLabel"
        onChange={(e) => setPanelLabel(!panelLabel)}
      />
    </div>
  );
};

export default Options;
