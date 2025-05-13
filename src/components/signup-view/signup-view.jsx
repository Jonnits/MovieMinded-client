import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export const SignupView = ({ onSignupSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday
    };

    try {
      const response = await fetch("https://movieminded-d764560749d0.herokuapp.com/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      if (response.ok) {
        alert("Signup successful. You may now log in.");
        navigate('/login');
      } else {
        alert(`Signup failed: ${responseData.errors?.[0]?.msg || responseData.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("An unexpected error occurred during signup.");
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <Card.Body>
        <Card.Title className="text-center">Sign Up</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              placeholder="Choose a username"
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter a secure password"
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </Form.Group>

          <Form.Group controlId="formBirthday" className="mb-3">
            <Form.Label>Birthday:</Form.Label>
            <Form.Control
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">
            Sign Up
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};