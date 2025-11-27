// src/components/Theme/useTheme.js
import { useEffect, useState } from "react";
const KEY = "djs_theme_v1";

export function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem(KEY) || "light");

  useEffect(() => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("podcastTheme", theme);
}, [theme]);

  const toggle = () => setTheme(t => (t === "light" ? "dark" : "light"));

  return { theme, toggle, setTheme };
}
