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
    const found = genres
      .filter((g) => g.shows.includes(String(podcastId)))
      .map((g) => g.title);

    return found.length ? found : ["Unknown"];
  };

  return (
    <div className={styles.carouselWrapper}>
      <button className={styles.navBtn} onClick={() => scrollBy(-1)}>◀</button>

      <div ref={scrollerRef} className={styles.carouselRow}>
        {items.map((pod) => (
          <div
            key={pod.id}
            className={styles.carouselCard}
            onClick={() => navigate(`/show/${pod.id}`)}
          >
            <img src={pod.image} alt={pod.title} className={styles.cardImg} />

            <h4 className={styles.cardTitle}>{pod.title}</h4>

            <div className={styles.chips}>
              {getGenres(pod.id).map((g) => (
                <span key={g} className={styles.chip}>
                  {g}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className={styles.navBtn} onClick={() => scrollBy(1)}>▶</button>
    </div>
  );
}
