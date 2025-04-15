import React, { useEffect, useState } from "react";
import { MovieCard } from "../movie-card/movie-card";
import { MovieView } from "../movie-view/movie-view";
import { ProfileView } from "../profile-view/profile-view";
import { LoginView } from "../login-view/login-view";
import { SignupView } from "../signup-view/signup-view";
import { NavigationBar } from "../navigation-bar/navigation-bar";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

const MainView = () => {
  let storedUser = null;
  try {
    storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && !Array.isArray(storedUser.FavoriteMovies)) {
      storedUser.FavoriteMovies = [];
    }
  } catch (e) {
    console.warn("Invalid JSON for user in localStorage, clearing it.");
    localStorage.removeItem("user");
  }  
  
  const storedToken = localStorage.getItem("token");  

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState(
    storedUser?.FavoriteMovies || []
  );

  useEffect(() => {
    if (!token) return;

    fetch("https://movieminded-d764560749d0.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
      });
  }, [token]);

  const updateFavorites = (newFavorites) => {
    setFavoriteMovies(newFavorites);
    const updatedUser = { ...user, FavoriteMovies: newFavorites };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <BrowserRouter>
      <NavigationBar
        user={user}
        onLoggedOut={() => {
          setUser(null);
          setToken(null);
          localStorage.clear();
        }}
      />

      <Routes>
        <Route
          path="/signup"
          element={
            user ? <Navigate to="/" /> : <SignupView />
          }
        />
        <Route
          path="/login"
          element={
            user ? <Navigate to="/" /> : (
<LoginView onLoggedIn={(user, token) => {
  if (!Array.isArray(user.FavoriteMovies)) {
    user.FavoriteMovies = [];
  }

  setUser(user);
  setToken(token);
  setFavoriteMovies(user.FavoriteMovies);
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("token", token);
}} />

            )
          }
        />
        <Route
          path="/profile"
          element={
            !user ? <Navigate to="/login" /> : (
              <ProfileView
                user={user}
                token={token}
                favoriteMovies={favoriteMovies}
                movies={movies}
                updateFavorites={updateFavorites}
              />
            )
          }
        />
        <Route
          path="/movies/:title"
          element={
            !user ? <Navigate to="/login" /> : (
              <MovieView movies={movies} />
            )
          }
        />
        <Route
          path="/"
          element={
            !user ? <Navigate to="/login" /> : movies.length === 0 ? (
              <div>The list is empty!</div>
            ) : (
              <>
                <Row className="justify-content-center">
                  {movies.map((movie) => (
                    <Col
                      className="mb-4"
                      key={movie.Title}
                      md={3}
                    >
                      <MovieCard
                        movie={{
                          Title: movie.Title,
                          Description: movie.Description,
                          ImagePath: movie.ImagePath,
                          Genre: movie.Genre,
                          Director: movie.Director,
                        }}
                        username={user.Username}
                        token={token}
                        favoriteMovies={favoriteMovies}
                        updateFavorites={updateFavorites}
                      />
                    </Col>
                  ))}
                </Row>
              </>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default MainView;
