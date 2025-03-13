import PropTypes from 'prop-types';

export const MovieView = ({ movie, onBackClick }) => {
    return (
        <div>
            <button onClick={onBackClick}>Back</button>
            <div>
                <div>
                    <img src={movie.image} />
                </div>
                <div>
                    <span>Title: </span>
                    <span>{movie.title}</span>
                </div>
                <div>
                    <span>Director: </span>
                    <span>{movie.director.Name}</span>
                </div>
                <div>
                    <span>Genre: </span>
                    <span>{movie.genre.Name} </span>
                </div>
                <div>
                    <span>Description: </span>
                    <span>{movie.description}</span>
                </div>
            </div>
        </div>
    );
};

MovieView.propTypes = {
    movie: PropTypes.shape({
        title: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        director: PropTypes.shape({
            Name: PropTypes.string.isRequired,
            Bio: PropTypes.string,
            Birth: PropTypes.string,
            Death: PropTypes.string
        }).isRequired,        
        genre: PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.string.isRequired,
                description: PropTypes.string
            })
        ).isRequired,        
        year: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired
    }).isRequired,
    onBackClick: PropTypes.func.isRequired
};