import React, { useState, useEffect } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

export const MainView = () => {
  const [movies, setMovies] = useState([]);
  const [user, setUser] = useState(localStorage.getItem("user") || null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("https://movieminded-d764560749d0.herokuapp.com/movies", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const moviesFromApi = data.map((doc) => ({
            id: doc._id,
            title: doc.Title,
            image: doc.ImagePath,
            description: doc.Description,
            genre: doc.Genre
              ? { name: doc.Genre.Name, description: doc.Genre.Description }
              : { name: "Unknown", description: "" },
            director: doc.Director
              ? { name: doc.Director.Name, bio: doc.Director.Bio }
              : { name: "Unknown", bio: "" },
            actors: doc.Actors || [],
            featured: doc.Featured || false,
          }));

          setMovies(moviesFromApi);
        })
        .catch((error) => {
          console.error("Error fetching movies:", error);
        });
    }
  }, [user]); 

  const handleLoggedIn = (user, token) => {
    setUser(user);
    localStorage.setItem("user", user);
    localStorage.setItem("token", token);
  };

  return (
    <BrowserRouter>
      <NavigationBar user={user} onLoggedOut={() => { setUser(null); localStorage.clear(); }} />

      <Row className="justify-content-md-center g-3">
        <Routes>
          <Route path="/signup" element={user ? <Navigate to="/" /> : <Col md={5}><SignupView /></Col>} />
          <Route path="/login" element={!user ? <Col md={8}><LoginView onLoggedIn={handleLoggedIn} /></Col> : <Navigate to="/" replace />} />
          <Route path="/movies/:movieId" element={!user ? <Navigate to="/login" replace /> : (movies.length === 0 ? <Col>The list is empty!</Col> : <Col md={8}><MovieView movies={movies} /></Col>)} />
          <Route
            path="/"
            element={!user ? (
              <Navigate to="/login" replace />
            ) : (
              movies.length === 0 ? (
                <Col>The list is empty!</Col>
              ) : (
                movies.map((movie) => (
                  <Col className="mb-4" key={movie.id} md={3}>
                    <MovieCard movie={movie} />
                  </Col>
                ))
              )
            )}
          />
        </Routes>
      </Row>
    </BrowserRouter>
  );
};
