import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./auth.css";

const mount = document.getElementById("auth-root");
if (!mount) throw new Error("The sign-in controls could not be mounted.");

createRoot(mount).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
