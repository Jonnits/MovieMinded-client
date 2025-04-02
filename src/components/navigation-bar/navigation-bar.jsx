import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { MainView } from "./components/main-view/main-view";
import Container from "react-bootstrap/Container";
import "boostrap/dist/css/bootstrap.min.css";
import "./index.scss";

export const NavigationBar = ({ user, onLoggedOut }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Books App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Add Links here */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const App = () => {
    return (
      <Container>
        <MainView />
      </Container>
    );
  };
  
  const container = document.querySelector("#root");
  const root = createRoot(container);
  root.render(<App />);