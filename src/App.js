import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./components/Register";


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
    </Routes>
  );
}

export default App;
