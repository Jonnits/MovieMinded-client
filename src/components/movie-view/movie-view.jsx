import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import "../../index.scss";

export const MovieView = ({ movies }) => {
  const { title } = useParams();

  // Match based on Title from backend (case-insensitive)
  const movie = movies.find(
    (m) => m.Title.toLowerCase() === decodeURIComponent(title).toLowerCase()
  );

  if (!movie) {
    return <div>Loading movie details...</div>;
  }

  return (
    <Card className="my-4">
      <Card.Img
        variant="top"
        src={movie.ImagePath}
        onError={(e) => (e.target.src = "/fallback.jpg")}
        alt={movie.Title}
      />
      <Card.Body>
        <Card.Title>{movie.Title}</Card.Title>
        <Card.Text>{movie.Description}</Card.Text>
        <Link to="/">
          <Button variant="primary">Back</Button>
        </Link>
      </Card.Body>
    </Card>
  );
};

MovieView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      Title: PropTypes.string.isRequired,
      Description: PropTypes.string.isRequired,
      ImagePath: PropTypes.string.isRequired,
    })
  ).isRequired,
};
