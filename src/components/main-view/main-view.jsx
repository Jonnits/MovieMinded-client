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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch("https://movieminded-d764560749d0.herokuapp.com/movies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => setMovies(data))
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setMovies([]); // Set empty array on error to prevent undefined issues
      });
  }, [token]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.Title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    setSearchQuery("");
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
      <NavigationBar user={user} onLoggedOut={handleLoggedOut} onSearch={handleSearch} />
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Row className="justify-content-center">
                {filteredMovies.map((movie) => (
                  <Col className="mb-4" key={movie._id} xs={12} sm={6} md={4} lg={3} xl={2}>
                    <MovieCard
                      movie={movie}
                      user={user}
                      token={token}
                      favoriteMovies={favoriteMovies}
                      updateFavorites={updateFavorites}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/movies/:movieId"
          element={
            user ? (
              <MovieView
                movies={movies}
                username={user.Username}
                token={token}
                favoriteMovies={favoriteMovies}
                updateFavorites={updateFavorites}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/profile"
          element={
            user ? (
              <ProfileView
                user={user}
                token={token}
                movies={movies}
                favoriteMovies={favoriteMovies}
                updateFavorites={updateFavorites}
                onUpdateProfile={handleUpdateProfile}
                onDeregister={handleDeregister}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <LoginView onLoggedIn={handleLoggedIn} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <SignupView />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default MainView;
