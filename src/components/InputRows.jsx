import React from "react";
import Table from "react-bootstrap/Table";
import panelLogoIcon from "../assets/icons/construction-clipboard.svg";
import CustomButton from "./custom/CustomButton";
import "../style/style.css";

const InputRows = (props) => {
  const {
    rows,
    handleDataChange,
    handleInputBlur,
    handleInputFocus,
    handleDelete,
    name,
    addRow,
    panelLabel,
  } = props;
  return (
    <div>
      <Table striped borderless hover variant="dark" size="sm" responsive>
        <thead>
          <tr>
            <th colSpan="5" className="text-capitalize">
              <img
                src={panelLogoIcon}
                alt=""
                width="30"
                height="30"
                className="d-inline-block align-top"
              />{" "}
              {name}
            </th>
          </tr>
          <tr>
            <th colSpan="1" className="text-capitalize">
              length
            </th>
            <th colSpan="1" className="text-capitalize">
              width
            </th>
            <th colSpan="1" className="text-capitalize">
              quantity
            </th>

            {panelLabel && (
              <th colSpan="1" className="text-capitalize">
                Label
              </th>
            )}
            <th colSpan="1" className="text-capitalize"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ length, width, quantity, label, result, id }, index) => {
            return (
              // <Row input={input} key={input.id}/>
              <tr>
                <td>
                  <input
                    type="number"
                    name="length"
                    value={length}
                    onChange={(e) => handleDataChange(e, id)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="width"
                    value={width}
                    onChange={(e) => handleDataChange(e, id)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </td>

                <td>
                  <input
                    type="number"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => handleDataChange(e, id)}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                  />
                </td>
                {panelLabel && (
                  <td>
                    <input
                      name="label"
                      value={label}
                      onChange={(e) => handleDataChange(e, id)}
                      onFocus={handleInputFocus}
                      onBlur={handleInputBlur}
                    />
                  </td>
                )}
                {/* <td>{result}</td> */}
                <td>
                  <CustomButton
                    backgroundColor="red"
                    width="100px"
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </CustomButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <CustomButton backgroundColor="blue" width="150px" onClick={addRow}>
        Add Row
      </CustomButton>
    </div>
  );
};

export default InputRows;
