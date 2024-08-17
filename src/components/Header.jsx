import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import menuIcon from "../assets/icons/menu.svg";
import settingsIcon from "../assets/icons/setting.svg";
import dropDownIcon from "../assets/icons/arrow.svg";
import executeIcon from "../assets/icons/play.svg";
import saveIcon from "../assets/icons/save.svg";
import logoIcon from "../assets/icons/grids.svg";

const Header = ({ optimizeData }) => {
  return (
    <header style={{ position: "fixed", width: "100%", zIndex: 999 }}>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#">
            <img
              alt=""
              src={logoIcon}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Alunex Optimizer
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarSupportedContent" />

          <Navbar.Collapse id="navbarSupportedContent">
            <Nav className="ms-auto align-items-center">
              <Button
                className="me-lg-2 me-sm-0"
                variant="success"
                onClick={optimizeData}
              >
                <img
                  src={executeIcon}
                  alt=""
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                />{" "}
                Calculate
              </Button>
              <ButtonGroup
                aria-label="save options"
                className="me-lg-2 me-sm-0 my-2"
              >
                <Button variant="secondary">Save</Button>
                <Button variant="secondary">Save as</Button>
              </ButtonGroup>
              {/* <div className="d-flex align-items-center"> */}
              <Button
                className="mt-2 mt-lg-0 me-lg-2 me-sm-0"
                variant="secondary"
              >
                Sign in
              </Button>
              <Button
                className="mt-2 mt-lg-0 me-lg-2 me-sm-0"
                variant="secondary"
              >
                <img alt="" src={settingsIcon} />
                <span className="visually-hidden">settings</span>
              </Button>
              <Button
                className="mt-2 mt-lg-0 me-lg-2 me-sm-0"
                variant="secondary"
              >
                Options
                {/* <span className="visually-hidden">menu items</span> */}
              </Button>
              {/* </div> */}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
