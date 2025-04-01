import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

export const SignupView = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      Username: username,
      Password: password,
      Email: email,
      Birthday: birthday ? new Date(birthday).toISOString() : null
    };

    fetch("https://movieminded-d764560749d0.herokuapp.com/users", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(async (response) => {
      const responseData = await response.json(); 
      if (response.ok) {
        alert("Signup successful");
        window.location.reload();
      } else {
        alert(`Signup failed: ${responseData.message || "Unknown error"}`);
      }
    })
    .catch((error) => console.error("Signup error:", error));
  };

  return (
    <Card className="p-4 shadow-sm">
      <Card.Body>
        <Card.Title className="text-center">Sign Up</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength="3"
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group controlId="formBirthday" className="mb-3">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Sign Up
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};