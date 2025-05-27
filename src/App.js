import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./components/Register";
import Profile from "./pages/Profile";
import { auth } from "./firebase-config";


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsAuthenticated(true);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (<Home setIsAuthenticated={setIsAuthenticated} />) : (<Navigate to="/auth" replace />)
        }
      />
      <Route
        path="/auth"
        element={<Register setIsAuthenticated={setIsAuthenticated} />}
      />
      <Route
        path="/profile"
        element={
          isAuthenticated ? (<Profile setIsAuthenticated={setIsAuthenticated} />) : (<Navigate to="/auth" replace />)
        }
      />
    </Routes>
  );
}

export default App;
