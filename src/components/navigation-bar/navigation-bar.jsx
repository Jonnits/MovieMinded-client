import React from "react";
import { Navbar, Nav, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export const NavigationBar = ({ user, onLoggedOut, onSearch }) => {
  return (
    <Navbar className="custom-navbar" expand="lg">
      <div className="container">
        <Navbar.Brand as={Link} to="/">MovieMinded</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {user && (
            <Form className="d-flex search-form-wrapper flex-grow-1 mx-lg-3 mx-md-2 mx-sm-1">
              <Form.Control
                type="search"
                placeholder="Which movies move you?"
                className="me-2 search-input"
                aria-label="Search"
                onChange={(e) => onSearch(e.target.value)}
              />
            </Form>
          )}
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
                <Nav.Link onClick={onLoggedOut}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};