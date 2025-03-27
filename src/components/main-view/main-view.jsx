import React, { useState, useEffect } from "react"; 
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export const MainView = () => {
    const [movies, setMovies] = useState([]);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [selectedMovie, setSelectedMovie] = useState(null);

    useEffect(() => {
        fetch("https://movieminded-d764560749d0.herokuapp.com/movies")
        .then((response) => response.json())
        .then((data) => {
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

    return (
        <Row className="justify-content-md-center">
            {!user ? (
          <Col md={5}>
            <LoginView onLoggedIn={(user, token) => {
                setUser(user);
                setToken(token);
            }} />
           <h3>Or</h3>
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
