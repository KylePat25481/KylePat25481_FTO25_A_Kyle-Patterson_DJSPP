import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { genres } from "../../data";
import styles from "./Carousel.module.css";

export default function Carousel({ items = [] }) {
  const scrollerRef = useRef(null);
  const navigate = useNavigate();

  const scrollBy = (dir = 1) => {
    const el = scrollerRef.current;
    if (!el || items.length === 0) return;
    const w = el.clientWidth;
    const maxScroll = el.scrollWidth - el.clientWidth;
    let newScroll = el.scrollLeft + w * dir * 0.7;
    if (newScroll < 0) newScroll = maxScroll;
    if (newScroll > maxScroll) newScroll = 0;
    el.scrollTo({ left: newScroll, behavior: "smooth" });
  };

  const getGenres = (podcastId) => {
    const genreTitles = genres
      .filter((g) => g.shows.includes(String(podcastId)))
      .map((g) => g.title);
    return genreTitles.length ? genreTitles : ["Unknown"];
  };

  return (
    <div className={styles.carouselWrapper}>
      <button className={styles.navBtn} onClick={() => scrollBy(-1)}>◀</button>
      <div className={styles.carouselRow} ref={scrollerRef}>
        {items.map((podcast) => (
          <div
            key={podcast.id}
            className={styles.carouselCard}
            onClick={() => navigate(`/show/${podcast.id}`)}
          >
            <img src={podcast.image} alt={podcast.title} className={styles.cardImg} />
            <h4 className={styles.cardTitle}>{podcast.title}</h4>
            <div className={styles.chips}>
              {getGenres(podcast.id).map((g) => (
                <span key={g} className={styles.chip}>{g}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className={styles.navBtn} onClick={() => scrollBy(1)}>▶</button>
    </div>
  );
}
