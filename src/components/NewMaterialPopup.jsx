import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button, Form } from "react-bootstrap";
import { openModal, closeModal, addMaterial } from "../store/Material.slice";

const NewMaterialPopup = () => {
  const dispatch = useDispatch();
  const { isModalOpen } = useSelector((state) => state.material);
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (name.trim()) {
      dispatch(addMaterial(name));
      setName("");
      dispatch(closeModal());
    }
  };

  return (
    <>
      <Modal show={isModalOpen} onHide={() => dispatch(closeModal())}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter material name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => dispatch(closeModal())}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NewMaterialPopup;
