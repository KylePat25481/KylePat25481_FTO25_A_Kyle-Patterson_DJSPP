// src/components/Header/Header.jsx
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import ThemeToggle from "../Theme/ThemeToggle";
import styles from "./Header.module.css"; // <<< use CSS module properly

export default function Header() {
  const location = useLocation();
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < lastScrollY || window.scrollY < 50) {
        setShowHeader(true);
      } else {
        setShowHeader(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`${styles.appHeader} ${showHeader ? styles.visible : styles.hidden}`}>
      {/* LEFT */}
      <div className={styles.left}>
        <div className={styles.brand}>
          <h1>🎙️ Podcast App</h1>
        </div>
      </div>

      {/* CENTER (expands to push nav to true center) */}
      <div className={styles.navWrapper}>
        <nav className={styles.navCenter}>
          <NavLink to="/" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            Home
          </NavLink>

          <NavLink to="/favourites" className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
            Favourites
          </NavLink>
        </nav>
      </div>

      {/* RIGHT */}
      <div className={styles.headerRight}>
        <ThemeToggle />
      </div>
    </header>
  );
}
