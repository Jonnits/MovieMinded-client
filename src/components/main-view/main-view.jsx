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
  const storedUser = (() => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData && !Array.isArray(userData.FavoriteMovies)) {
        userData.FavoriteMovies = [];
      }
      return userData;
    } catch (e) {
      console.warn("Invalid JSON for user in localStorage, clearing it.");
      localStorage.removeItem("user");
      return null;
    }
  })();

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
      .then((data) => setMovies(data))
      .catch((error) =>
        console.error("Error fetching movies:", error)
      );
  }, [token]);

  const handleLoggedIn = (user, token) => {
    if (!Array.isArray(user.FavoriteMovies)) {
      user.FavoriteMovies = [];
    }

    setUser(user);
    setToken(token);
    setFavoriteMovies(user.FavoriteMovies);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  const handleLoggedOut = () => {
    setUser(null);
    setToken(null);
    setFavoriteMovies([]);
    localStorage.clear();
  };

  const updateFavorites = (newFavorites) => {
    setFavoriteMovies(newFavorites);
    const updatedUser = { ...user, FavoriteMovies: newFavorites };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleUpdateProfile = (updatedUserData) => {
    fetch(`https://movieminded-d764560749d0.herokuapp.com/users/${user.Username}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Profile update failed");
        return res.json();
      })
      .then((updatedUser) => {
        setUser(updatedUser);
        setFavoriteMovies(updatedUser.FavoriteMovies || []);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Profile updated successfully");
      })
      .catch((err) => console.error("Profile update error:", err));
  };

  const handleDeregister = () => {
    fetch(`https://movieminded-d764560749d0.herokuapp.com/users/${user.Username}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Deregistration failed");
        alert("Account deleted");
        handleLoggedOut();
      })
      .catch((err) => console.error("Deregister error:", err));
  };

  return (
    <BrowserRouter>
      <NavigationBar user={user} onLoggedOut={handleLoggedOut} />

      <Routes>
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <SignupView />}
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" />
            ) : (
              <LoginView onLoggedIn={handleLoggedIn} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : (
              <ProfileView
                user={user}
                token={token}
                favoriteMovies={favoriteMovies}
                movies={movies}
                updateFavorites={updateFavorites}
                onUpdateProfile={handleUpdateProfile}
                onDeregister={handleDeregister}
              />
            )
          }
        />
        <Route
          path="/movies/:title"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : (
              <MovieView movies={movies} />
            )
          }
        />
        <Route
          path="/"
          element={
            !user ? (
              <Navigate to="/login" />
            ) : movies.length === 0 ? (
              <div>The list is empty!</div>
            ) : (
              <Row className="justify-content-center">
                {movies.map((movie) => (
                  <Col className="mb-4" key={movie._id} md={3}>
                    <MovieCard
                      movie={movie}
                      username={user.Username}
                      token={token}
                      favoriteMovies={favoriteMovies}
                      updateFavorites={updateFavorites}
                    />
                  </Col>
                ))}
              </Row>
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default MainView;
