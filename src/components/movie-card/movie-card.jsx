import React from "react";
import PropTypes from 'prop-types';
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
  const isFavorite = favoriteMovies?.includes(movie.title);

  const handleFavoriteToggle = () => {
    if (onRemoveFavorite) {
      onRemoveFavorite(movie.title);
      return;
    }

    const url = `https://your-api-url.com/users/${username}/movies/${encodeURIComponent(movie.title)}`;
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
    <Card>
      <Card.Img variant="top" src={movie.image} />
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Text>{movie.description}</Card.Text>

        <Button
          variant={isFavorite || onRemoveFavorite ? "danger" : "success"}
          onClick={handleFavoriteToggle}
          className="mb-2"
        >
          {isFavorite || onRemoveFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </Button>

        <Link to={`/movies/${encodeURIComponent(movie.title)}`}>
          <Button variant="primary">Open</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genre: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string
    }).isRequired,
    director: PropTypes.shape({
      name: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired
    }).isRequired,
  }).isRequired,
  username: PropTypes.string,
  token: PropTypes.string,
  favoriteMovies: PropTypes.array,
  updateFavorites: PropTypes.func,
  onRemoveFavorite: PropTypes.func
};
