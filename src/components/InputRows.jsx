import React from "react";
import Table from "react-bootstrap/Table";
import panelLogoIcon from "../assets/icons/construction-clipboard.svg";
import CustomButton from "./custom/CustomButton";
import "../style/style.css";
import { ImCancelCircle } from "react-icons/im";
import { FaArrowsAltH, FaArrowsAltV } from "react-icons/fa";
import { TiStarburst } from "react-icons/ti";

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
    children,
    addMaterialToSheets,
    considerGrainDirection,
    changeGrainDirection,
  } = props;

  const grainDirections = [
    {
      id: 1,
      name: "vertical",
      icon: <FaArrowsAltV style={{ fontSize: "25px", cursor: "pointer" }} />,
    },
    {
      id: 2,
      name: "horizontal",
      icon: <FaArrowsAltH style={{ fontSize: "25px", cursor: "pointer" }} />,
    },
    {
      id: 3,
      name: "star",
      icon: <TiStarburst style={{ fontSize: "25px", cursor: "pointer" }} />,
    },
  ];
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

            {addMaterialToSheets && (
              <th colSpan="1" className="text-capitalize">
                Material
              </th>
            )}
            {panelLabel && (
              <th colSpan="1" className="text-capitalize">
                Label
              </th>
            )}
            <th colSpan="1" className="text-capitalize"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(
            (
              {
                length,
                width,
                quantity,
                label,
                material,
                grainDirection,
                result,
                id,
              },
              index
            ) => {
              const getGrainDirection = grainDirections.find(
                (grain) => grain.name === grainDirection
              );
              return (
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
                  {addMaterialToSheets && (
                    <td>
                      <input
                        name="material"
                        value={material}
                        onChange={(e) => handleDataChange(e, id)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                      />
                    </td>
                  )}
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
                  <td>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {considerGrainDirection && (
                        <div
                          style={{ marginRight: "8px", cursor: "pointer" }}
                          onClick={() => {
                            const nextGrainID =
                              getGrainDirection.id + 1 > 3
                                ? 1
                                : getGrainDirection.id + 1;
                            const getNextGrain = grainDirections.find(
                              (grain) => grain.id === nextGrainID
                            );

                            changeGrainDirection(getNextGrain, id);
                          }}
                        >
                          {getGrainDirection && getGrainDirection.icon}
                        </div>
                      )}
                      <div
                        style={{ marginTop: "5px", cursor: "pointer" }}
                        onClick={() => handleDelete(id)}
                      >
                        <ImCancelCircle
                          style={{ color: "red", fontSize: "25px" }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            }
          )}
        </tbody>
      </Table>
      <CustomButton backgroundColor="blue" width="150px" onClick={addRow}>
        Add Row
      </CustomButton>
      {children}
    </div>
  );
};

export default InputRows;
