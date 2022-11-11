import React from "react";
import { Navbar, Container, Nav } from 'react-bootstrap';
import "./header.css";
const Header = () => {
  return (
    <div>

      <Navbar bg="dark" className="m-navbar" variant="dark">
        <Container>
          <Navbar.Brand href="#home centre-x justify-content-centre mx-auto red"><i className="bi bi-journal-text"></i> Note app using Blockchain </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="#home"> </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};

export default Header;
