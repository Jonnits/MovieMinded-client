import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

export const LoginView = ({ onLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password
    };

    try {
      const response = await fetch("https://movieminded-d764560749d0.herokuapp.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message || "Invalid credentials"}`);
        return;
      }

      const result = await response.json();
      if (result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", result.user.Username);
        onLoggedIn(result.user.Username, result.token);
      } else {
        alert("Login failed: Token not received.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An unexpected error occurred during login.");
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <Card.Body>
        <Card.Title className="text-center">Login</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Submit
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};
