import React, { useEffect } from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

const ErrorModal = ({ show, onClose, messages }) => {
  console.log({ messages });
  useEffect(() => {
    const hasContinue = messages.every((message) => message.continue === true);

    if (show && hasContinue) {
      const timer = setTimeout(() => onClose(true), 5000);
      return () => clearTimeout(timer); // Clear timer if the component is unmounted
    }
  }, [show, onClose, messages]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Messages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {messages.map((message, index) => (
            <ListGroup.Item
              key={index}
              variant={message.type === "error" ? "danger" : "warning"}
              style={{
                backgroundColor:
                  message.type === "error" ? "#f8d7da" : "#fff3cd",
                borderColor: message.type === "error" ? "#f5c6cb" : "#ffeeba",
                color: message.type === "error" ? "#721c24" : "#856404",
              }}
            >
              {message.message}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
