import React from "react";
import ReactDOM from "react-dom/client";
import App from "./client/App.js";
import "./styles/globals.css";

document.documentElement.classList.add("dark");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
