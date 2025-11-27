// src/components/Theme/ThemeToggle.jsx
import React from "react";
import { useTheme } from "./useTheme";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button className="theme-toggle-btn" onClick={toggle} aria-label="Toggle theme">
      <div className={`switch ${theme === "dark" ? "on" : "off"}`}>
        <div className="knob">{theme === "dark" ? "🌙" : "☀️"}</div>
      </div>
    </button>
  );
}
