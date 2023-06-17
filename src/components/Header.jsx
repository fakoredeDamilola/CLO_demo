import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

const Header = () => {
  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">Cutlist Optimizer</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarSupportedContent" />

          <Navbar.Collapse id="navbarSupportedContent">
            <Nav className="ms-auto align-items-center">
              <Button className="me-2">Calculate</Button>
              <ButtonGroup aria-label="save options" className="me-2 my-2">
                <Button>Save</Button>
                <Button>Save as</Button>
              </ButtonGroup>
              <div className="d-flex flex-column align-items-center">
                <Button className="mb-2">Settings</Button>
                <Button className="mb-2">Sign in</Button>
                <Button className="mb-2">More</Button>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
