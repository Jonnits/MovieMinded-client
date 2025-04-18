import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../index.scss";

export const MovieCard = ({
  movie,
  username,
  token,
  favoriteMovies,
  updateFavorites
}) => {
  let userFromStorage = null;
  let tokenFromStorage = null;

  try {
    const rawUser = localStorage.getItem("user");
    userFromStorage = rawUser ? JSON.parse(rawUser) : null;
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
  }

  tokenFromStorage = localStorage.getItem("token");

  const finalUsername = username || userFromStorage?.Username;
  const finalToken = token || tokenFromStorage;

  if (!finalUsername || !finalToken) {
    console.warn("DEBUG - finalUsername:", finalUsername);
    console.warn("DEBUG - finalToken:", finalToken);
  }

  const isFavorite = favoriteMovies?.some(
    (fav) => (typeof fav === "string" ? fav === movie._id : fav._id === movie._id)
  );  

  const handleFavoriteToggle = () => {
    if (!finalUsername || !finalToken) {
      console.error("Username or token is missing!");
      return;
    }

    const encodedTitle = encodeURIComponent(movie.Title);
    const url = `https://movieminded-d764560749d0.herokuapp.com/users/${finalUsername}/movies/${encodedTitle}`;
    const method = isFavorite ? "DELETE" : "POST";

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${finalToken}`,
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update favorites");
        }
        return response.json();
      })
      .then((updatedUser) => {
        if (updateFavorites) {
          updateFavorites(updatedUser.FavoriteMovies);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      })
      .catch((error) => {
        console.error("Error updating favorites:", error);
      });
  };

  return (
    <Card className="h-100">
      <Card.Img
        variant="top"
        src={movie.ImagePath}
        onError={(e) => (e.target.src = "/fallback.jpg")}
      />
      <Card.Body>
        <Card.Title>{movie.Title}</Card.Title>
        <Card.Text>{movie.Description}</Card.Text>

        <Button
          variant={isFavorite ? "danger" : "success"}
          onClick={handleFavoriteToggle}
          className="mb-2"
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Button>

        <Link to={`/movies/${encodeURIComponent(movie.Title)}`}>
          <Button variant="primary">Open</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Description: PropTypes.string.isRequired,
    ImagePath: PropTypes.string.isRequired,
    Genre: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Description: PropTypes.string
    }).isRequired,
    Director: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Bio: PropTypes.string.isRequired
    }).isRequired,
    Actors: PropTypes.array
  }).isRequired,
  username: PropTypes.string,
  token: PropTypes.string,
  favoriteMovies: PropTypes.array,
  updateFavorites: PropTypes.func
};
