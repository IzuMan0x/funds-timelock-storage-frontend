import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

//
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div
      className="bg-[url('./assets/finance-background.jpg')] bg-cover h-screen w-screen flex justify-center bg-center md:bg-contain
    "
    >
      <App />
    </div>
  </React.StrictMode>
);
