import { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";

export const MainView = () => {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!token) {
            return;
        }

        fetch("https://movieminded-d764560749d0.herokuapp.com/movies", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data); 
        });
    }, [token]);

    if (!user) {
        return (
        <LoginView 
        onLoggedIn={(user, token) => {
            setUser(user);
            setToken(token);
        }} 
        />
    );
    }

    if (selectedMovie) {
        return (
            <>
            <button 
                onClick={() => {
                    setUser(null);
                    setToken(null);
                }}
                > Logout </button>
        <MovieView movie={selectedMovie} onBackClick={() => setSelectedMovie(null)} 
            />
            </>
        );
    }

    if (movies.length === 0) {
        return <div>The list is empty!</div>;
    }

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