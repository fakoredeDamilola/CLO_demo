export function formatToTableData(notPlacedPanel) {
  return notPlacedPanel.map((data) => ({
    length: data.panelLength,
    width: data.panelWidth,
    quantity: `${data.panelCount}`,
    label: data.groupName,
  }));
}
