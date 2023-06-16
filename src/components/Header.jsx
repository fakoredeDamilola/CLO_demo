import React from "react";
// import { Container } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
// import Nav from "react-bootstrap/Nav";
// import ButtonGroup from "react-bootstrap";
// import Button from "react-bootstrap";

const Header = () => {
  return (
    <header>
      <Navbar className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Cutlist Optimizer
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button className="btn btn-secondary">Calculate</button>
              </li>
              <div className="btn-group" role="group">
                <li className="nav-item">
                  <button className="btn btn-secondary">Save</button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-secondary">Save as</button>
                </li>
              </div>
              <li className="nav-item">
                <button className="btn btn-secondary">settings</button>
              </li>
              <li className="nav-item">
                <button class="btn btn-secondary">Sign in</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary">more</button>
              </li>
            </ul>
          </div>
        </div>
      </Navbar>
    </header>
  );
};

export default Header;
