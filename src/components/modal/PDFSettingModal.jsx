import React from "react";
import { FormControl, InputGroup, Modal, Button } from "react-bootstrap";
import Footer from "../Footer";

const PDFSettingModal = ({
  showPdfModal,
  setShowPdfModal,
  pdfHeaderText,
  setPdfHeaderText,
  setPdfFileName,
  pdfFileName,
  setGeneratePDFData,
}) => {
  const onClose = () => {
    setShowPdfModal(false);
  };
  const createPDF = () => {
    setGeneratePDFData(true);
    setShowPdfModal(false);
  };
  return (
    <Modal show={showPdfModal} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Messages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup>
          <InputGroup.Text>File Name</InputGroup.Text>
          <FormControl
            placeholder="Enter file name"
            aria-label="File Name"
            value={pdfFileName}
            onChange={(e) => setPdfFileName(e.target.value)}
          />
          <InputGroup.Text>.pdf</InputGroup.Text>
        </InputGroup>
        <InputGroup className="mt-3">
          <InputGroup.Text>File Header</InputGroup.Text>
          <FormControl
            placeholder="Enter file header"
            aria-label="File header"
            value={pdfHeaderText}
            onChange={(e) => setPdfHeaderText(e.target.value)}
          />
        </InputGroup>
      </Modal.Body>
      <Footer />
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={createPDF}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PDFSettingModal;
