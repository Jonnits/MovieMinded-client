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
  updateFavorites,
  onRemoveFavorite
}) => {
  const isFavorite = favoriteMovies?.includes(movie.Title);

  const handleFavoriteToggle = () => {
    if (onRemoveFavorite) {
      onRemoveFavorite(movie.Title);
      return;
    }

    const url = `https://movieminded-d764560749d0.herokuapp.com/users/${username}/movies/${encodeURIComponent(movie.Title)}`;
    const method = isFavorite ? 'DELETE' : 'POST';

    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update favorites');
        }
        return response.json();
      })
      .then((updatedUser) => {
        if (updateFavorites) {
          updateFavorites(updatedUser.FavoriteMovies);
        }
      })
      .catch((error) => {
        console.error('Error updating favorites:', error);
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
          variant={isFavorite || onRemoveFavorite ? "danger" : "success"}
          onClick={handleFavoriteToggle}
          className="mb-2"
        >
          {isFavorite || onRemoveFavorite ? "Remove from Favorites" : "Add to Favorites"}
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
  updateFavorites: PropTypes.func,
  onRemoveFavorite: PropTypes.func
};
