// src/App.jsx
import React from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./routes/Routes"; // Adjust the path if necessary

const App = () => {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
};

export default App;
