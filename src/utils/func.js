import { v4 as uuidv4 } from "uuid";

export function formatToTableData(notPlacedPanel) {
  return notPlacedPanel.map((data) => ({
    length: data.panelLength,
    width: data.panelWidth,
    quantity: `${data.panelCount}`,
    label: data.groupName,
  }));
}

export function autoGenerateName(name) {
  const generateNameWithDate = name.split(" ").join("_").toLowerCase();
  const date = new Date();
  const formattedDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
  return `${generateNameWithDate}_${formattedDate}`;
}

export const handleCheckFields = (data) => {
  const updatedData = data.map((item) => ensureFields(item));
  return updatedData;
};

const ensureFields = (data) => {
  const uniqueID = uuidv4();
  const defaultFields = {
    id: uniqueID,
    length: "",
    quantity: "",
    width: "",
    label: "",
    material: "",
    result: "",
    selected: true,
    grainDirection: "horizontal",
  };

  // Merge defaultFields with data, adding missing fields
  return { ...defaultFields, ...data };
};

export function getUniqueId() {
  return uuidv4();
}

export function getPanelDetails(panels) {
  const result = [];

  panels.forEach((panel) => {
    const existingGroup = result.find(
      (group) =>
        group.panelGroup === panel.panelGroup &&
        group.length === panel.length &&
        group.width === panel.width
    );

    if (existingGroup) {
      // Update the existing group with new quantities, lengths, and widths
      existingGroup.quantity += 1;
    } else {
      // Add a new group for the panelGroup
      result.push({
        panelGroup: panel.panelGroup,
        quantity: 1,
        length: panel.length,
        width: panel.width,
      });
    }
  });

  return result;
}
