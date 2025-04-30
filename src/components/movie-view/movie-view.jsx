import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import "../../index.scss";

export const MovieView = ({ movies, username, token, favoriteMovies, updateFavorites }) => {
  const { movieId } = useParams();
  const movie = Array.isArray(movies)
    ? movies.find(
        (m) =>
          m?.Title &&
          m.Title.toLowerCase() === decodeURIComponent(movieId).toLowerCase()
      )
    : null;

  if (!movie) {
    return <div>Loading movie details...</div>;
  }

  const isFavorite = favoriteMovies?.some(
    (fav) => (typeof fav === "string" ? fav === movie._id : fav._id === movie._id)
  );

  const handleFavoriteToggle = () => {
    if (!username || !token) {
      console.error("Username or token is missing!");
      return;
    }

    const encodedTitle = encodeURIComponent(movie.Title);
    const url = `https://movieminded-d764560749d0.herokuapp.com/users/${username}/movies/${encodedTitle}`;
    const method = isFavorite ? "DELETE" : "POST";

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
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
    <Card className="my-4">
      <Card.Img
        variant="top"
        src={movie.ImagePath}
        onError={(e) => (e.target.src = "/fallback.jpg")}
      />
      <Card.Body>
        <Card.Title>{movie.Title}</Card.Title>
        <Card.Text>{movie.Description}</Card.Text>
        <hr />
        <Card.Text><strong>Genre:</strong> {movie.Genre?.Name}</Card.Text>
        <Card.Text><strong>Genre Description:</strong> {movie.Genre?.Description}</Card.Text>
        <hr />
        <Card.Text><strong>Director:</strong> {movie.Director?.Name}</Card.Text>
        <Card.Text><strong>Bio:</strong> {movie.Director?.Bio}</Card.Text>
        <hr />
        <Card.Text><strong>Actors:</strong> {movie.Actors?.join(", ")}</Card.Text>
        <div className="d-flex justify-content-between mt-3">
          <Link to="/">
            <Button variant="primary">Back</Button>
          </Link>
          <Button
            variant={isFavorite ? "danger" : "success"}
            onClick={handleFavoriteToggle}
          >
            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      Title: PropTypes.string.isRequired,
      Description: PropTypes.string.isRequired,
      ImagePath: PropTypes.string,
      Genre: PropTypes.shape({
        Name: PropTypes.string,
        Description: PropTypes.string
      }),
      Director: PropTypes.shape({
        Name: PropTypes.string,
        Bio: PropTypes.string
      }),
      Actors: PropTypes.arrayOf(PropTypes.string),
      _id: PropTypes.string.isRequired,
    })
  ).isRequired,
  username: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  favoriteMovies: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateFavorites: PropTypes.func.isRequired,
};
