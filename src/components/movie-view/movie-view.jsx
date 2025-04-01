import React from "react";
import PropTypes from "prop-types";
import { Button, Card } from "react-bootstrap";

export const MovieView = ({ movie, onBackClick }) => {
    return (
        <Card className="movie-view">
            <Card.Img variant="top" src={movie.image} />
            <Card.Body>
                <Card.Title>{movie.title}</Card.Title>
                <Card.Text>{movie.description}</Card.Text>

                <Card.Text>
                    <strong>Director:</strong> {movie.director.name}<br />
                    <strong>Bio:</strong> {movie.director.bio}
                </Card.Text>

                <Card.Text>
                    <strong>Genre:</strong> {movie.genre.name}<br />
                    <strong>Description:</strong> {movie.genre.description}
                </Card.Text>

                <Button variant="primary" onClick={onBackClick}>
                    Back to Movies
                </Button>
            </Card.Body>
        </Card>
    );
};

MovieView.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        director: PropTypes.shape({
            name: PropTypes.string.isRequired,
            bio: PropTypes.string.isRequired,
        }).isRequired,
        genre: PropTypes.shape({
            name: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    onBackClick: PropTypes.func.isRequired,
};
