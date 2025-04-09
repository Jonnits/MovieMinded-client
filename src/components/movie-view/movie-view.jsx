import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import "../../index.scss";

export const MovieView = ({ movies }) => {
  const { title } = useParams();

  console.log("MovieView mounted");
  console.log("URL title param:", title);
  console.log("Movies prop:", movies);

  if (Array.isArray(movies)) {
    movies.forEach((m, i) =>
      console.log(`Movie ${i + 1}: ${m.Title}`)
    );
  }

  const movie = Array.isArray(movies)
    ? movies.find(
        (m) =>
          m?.Title &&
          m.Title.toLowerCase() === decodeURIComponent(title).toLowerCase()
      )
    : null;

  if (!movie) {
    return <div>Loading movie details...</div>;
  }

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
    })
  ).isRequired,
};
