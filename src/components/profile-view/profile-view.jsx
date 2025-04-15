import React, { useState, useEffect } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { MovieCard } from "../movie-card/movie-card";

export const ProfileView = ({ user, movies, token, onDeregister, onUpdateProfile }) => {
  const [username, setUsername] = useState(user.Username);
  const [email, setEmail] = useState(user.Email);
  const [birthday, setBirthday] = useState(user.Birthday);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    if (!user || !Array.isArray(user.FavoriteMovies)) return;

    const favMovies = movies.filter((movie) =>
      user.FavoriteMovies.includes(movie.Title)
    );
    setFavoriteMovies(favMovies);
  }, [movies, user]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedUser = {
      Username: username,
      Email: email,
      Birthday: birthday,
      NewPassword: newPassword || password,
    };
    onUpdateProfile(updatedUser);
  };

  const handleDeregister = () => {
    onDeregister(user.Username);
  };

  const updateFavorites = (newFavorites) => {
    const updatedFavMovies = movies.filter((m) =>
      newFavorites.includes(m.Title)
    );
    setFavoriteMovies(updatedFavMovies);

    const updatedUser = { ...user, FavoriteMovies: newFavorites };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <Card className="p-4 shadow-sm mt-4">
      <Card.Body>
        <Card.Title className="text-center mb-4 fs-3">My Account</Card.Title>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBirthday" className="mb-3">
            <Form.Label>Birthday</Form.Label>
            <Form.Control
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formNewPassword" className="mb-4">
            <Form.Label>New Password (Optional)</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Update Profile
          </Button>
        </Form>

        <Button
          variant="danger"
          onClick={handleDeregister}
          className="w-100 mt-3"
        >
          Delete Account
        </Button>

        <h5 className="mt-5 mb-3">Your Favorite Movies</h5>
        <div className="d-flex flex-wrap justify-content-start">
          {favoriteMovies.length === 0 ? (
            <p>You have no favorite movies yet.</p>
          ) : (
            favoriteMovies.map((movie) => (
              <div
                key={movie.Title}
                className="me-3 mb-4"
                style={{ width: "18rem" }}
              >
                <MovieCard
                  movie={movie}
                  username={username}
                  token={token}
                  favoriteMovies={user.FavoriteMovies}
                  updateFavorites={updateFavorites}
                />
              </div>
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  );
};
