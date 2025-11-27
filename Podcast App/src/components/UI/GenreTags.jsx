// src/components/Podcasts/GenreTags.jsx
import React from "react";
import { genres as genreMap } from "../../data";
import styles from "./GenreTags.module.css";

export default function GenreTags({ genres }) {
  if (!genres || genres.length === 0) return null;

  return (
    <div className={styles.tags}>
      {genres.map((id) => {
        const match = genreMap.find((g) => g.id === id);
        return (
          <span key={id} className={styles.tag}>
            {match ? match.title : `Unknown (${id})`}
          </span>
        );
      })}
    </div>
  );
}
