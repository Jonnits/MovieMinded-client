import PropTypes from 'prop-types';

export const MovieCard = ({ movie, onMovieClick }) => {
    return (
        <div
            onClick={() => {
                console.log("Movie clicked: ", movie);
                onMovieClick(movie);
            }}
        >
            {movie.title}
        </div>
    );
};

MovieCard.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        genre: PropTypes.shape({
            Name: PropTypes.string.isRequired,
            Description: PropTypes.string
        }).isRequired,
        director: PropTypes.shape({ 
            Name: PropTypes.string.isRequired
        }).isRequired,
        description: PropTypes.string.isRequired
    }).isRequired,
    onMovieClick: PropTypes.func.isRequired
};
