import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";

export const MainView = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetch("https://movieminded-d764560749d0.herokuapp.com/movies")
        .then((response) => response.json())
        .then((data) => {
            console.log("API response:", data); // Debugging log
            const moviesFromApi = data.map((movie) => ({
                id: movie._id,
                title: movie.Title,
                image: movie.ImagePath,
                description: movie.Description,
                genre: movie.Genre ? { 
                    Name: movie.Genre.Name, 
                    Description: movie.Genre.Description 
                } : { Name: "Unknown", Description: "" }, 
                director: movie.Director ? { Name: movie.Director.Name } : { Name: "Unknown" }
            }));
            setMovies(moviesFromApi);
        })
        .catch((error) => {
            console.error("Error fetching movies:", error);
        });    
    }, []);    

    const [selectedMovie, setSelectedMovie] = useState(null);

    if (selectedMovie) {
        return (
        <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} />
        );
    }

    if (movies.length === 0) {
        return <div>The list is empty!</div>;
    }

    console.log("Selected movie:", selectedMovie);

    return (
        <div>
            <h1>MyFlix Movies</h1>
            <div>
                {movies.map((movie) => (
                    <MovieCard 
                        key={movie.id}
                        movie={movie} 
                        onMovieClick={(newSelectedMovie) => {
                            setSelectedMovie(newSelectedMovie);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
