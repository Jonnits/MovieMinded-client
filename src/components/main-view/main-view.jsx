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

  const handleUpdateProfile = (updatedUserData) => {
    fetch(`https://movieminded-d764560749d0.herokuapp.com/users/${user.Username}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedUserData)
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Profile update failed");
        }
        return res.json();
      })
      .then((updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("Profile updated successfully");
      })
      .catch((err) => console.error("Profile update error:", err));
  };

  const handleDeregister = (username) => {
    fetch(`https://movieminded-d764560749d0.herokuapp.com/users/${username}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Deregistration failed");
        alert("Account deleted");
        localStorage.clear();
        setUser(null);
        setToken(null);
      })
      .catch((err) => console.error("Deregister error:", err));
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
        {/* other routes unchanged */}
        <Route
          path="/profile"
          element={
            !user ? <Navigate to="/login" /> : (
              <ProfileView
                user={user}
                token={token}
                movies={movies}
                favoriteMovies={favoriteMovies}
                updateFavorites={updateFavorites}
                onUpdateProfile={handleUpdateProfile}
                onDeregister={handleDeregister}
              />
            )
          }
        />
        {/* other routes unchanged */}
      </Routes>
    </BrowserRouter>
  );
};

export default MainView;