// src/components/UI/Header.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "../Theme/ThemeToggle";
import "./Header.module.css";

export default function Header() {
  const loc = useLocation();

  return (
    <header className="appHeader container">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div className="logo">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path fill="currentColor" d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9Zm-1 13v-6l5 3-5 3Z" />
          </svg>
        </div>
        <div className="brand"><h1>🎙️ Podcast App</h1> </div>
      </div>

      <nav className="navCenter">
        <NavLink to="/" className={({isActive}) => isActive ? "navLink active" : "navLink"}>Home</NavLink>
        <NavLink to="/favourites" className={({isActive}) => isActive ? "navLink active" : "navLink"}>Favourites</NavLink>
      </nav>

      <div className="headerRight">
        <ThemeToggle />
      </div>
    </header>
  );
}
