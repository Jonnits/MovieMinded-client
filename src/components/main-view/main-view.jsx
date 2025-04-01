import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const MainView = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const [user, setUser] = useState(storedUser? storedUser : null);
    const [token, setToken] = useState(storedToken? storedToken : null);
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");

        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);    

    useEffect(() => {
        if (!token) return;
        
        fetch("https://movieminded-d764560749d0.herokuapp.com/movies", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, 
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const moviesFromApi = data.map((movie) => ({
                id: movie._id,
                title: movie.Title,
                image: movie.ImagePath,
                description: movie.Description,
                genre: movie.Genre ? { 
                    name: movie.Genre.Name, 
                    description: movie.Genre.Description 
                } : { name: "Unknown", description: "" }, 
                director: movie.Director ? { 
                    name: movie.Director.Name,
                    bio: movie.Director.Bio
                } : { name: "Unknown", bio: "" },
                actors: movie.Actors || [],
                featured: movie.Featured || false
            }));
            setMovies(moviesFromApi);
        })
        .catch((error) => {
            console.error("Error fetching movies:", error);
        });    
    }, [token]);    

    return (
        <Row className="justify-content-md-center g-3">
            {!user ? (
                <Col md={5}>
                    <LoginView onLoggedIn={(user, token) => {
                        setUser(user);
                        setToken(token);
                    }} />
                    <h3 className="text-center my-3">Or</h3>
                    <SignupView />
                </Col>
            ) : selectedMovie ? (
                <Col md={8}>
                    <MovieView 
                        movie={selectedMovie} 
                        onBackClick={() => setSelectedMovie(null)} 
                    />
                </Col>
            ) : movies.length === 0 ? (
                <div>The list is empty!</div>
            ) : (
                <>
                    {movies.map((movie) => (
                        <Col key={movie.id} md={3}>
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                onMovieClick={(newSelectedMovie) => {
                                    setSelectedMovie(newSelectedMovie);
                                }}
                            />
                        </Col>
                    ))}
                </>
            )}
        </Row>
    );
};
