import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const PasteContentModal = ({ parseTableData }) => {
  const [show, setShow] = useState(false);
  const [tableData, setTableData] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handlePasteChange = (e) => {
    setTableData(e.target.value);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="primary" className="mt-3" onClick={handleShow}>
          Paste content
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Paste Table Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="pasteTableContent">
            <Form.Label>Paste Table Data Here</Form.Label>
            <Form.Control
              as="textarea"
              rows={6}
              value={tableData}
              onChange={handlePasteChange}
              placeholder="Paste your table here"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              if (tableData.length > 0) {
                parseTableData(tableData);
              }
              handleClose();
            }}
            className="mt-1"
          >
            Convert to Object
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PasteContentModal;
