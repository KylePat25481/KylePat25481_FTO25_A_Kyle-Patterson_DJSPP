// src/components/Podcasts/PodcastCard.jsx
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import styles from "./PodcastCard.module.css";
import GenreTags from "../UI/GenreTags";
import { usePlayer } from "../AudioPlayer/PlayerProvider";
import { useFavourites } from "../Favourites/useFavourites";

/**
 * Renders a single podcast preview card
 */
export default function PodcastCard({ podcast }) {
  const navigate = useNavigate();
  const { setSource, play } = usePlayer();
  const { toggle, isFavourited } = useFavourites();

  const handleNavigate = (preview) => {
    navigate(`/show/${preview.id}`, { state: { genres: preview.genres } });
  };

  const handlePlayShowSample = (e) => {
    e.stopPropagation();
    // If API provides sample audio at podcast.sample or similar, use it; fallback to soundhelix sample
    const sample = podcast.audio || podcast.sample || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    setSource(sample, { autoPlay: true });
  };

  return (
    <div className={styles.card} onClick={() => handleNavigate(podcast)}>
      <img src={podcast.image} alt={podcast.title} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>{podcast.title}</h3>
        <div>
          <button aria-label="Play show" onClick={handlePlayShowSample} style={{ marginRight: 8 }} onMouseDown={(e) => e.stopPropagation()}>
            ▶
          </button>
          <button onClick={(e) => { e.stopPropagation(); toggle({
            episodeId: `show-${podcast.id}`,
            title: podcast.title,
            showId: podcast.id,
            showTitle: podcast.title,
            seasonIndex: 0,
          }); }} aria-pressed={isFavourited(`show-${podcast.id}`)}>
            {isFavourited(`show-${podcast.id}`) ? "♥" : "♡"}
          </button>
        </div>
      </div>

      <p className={styles.seasons}>{podcast.seasons} seasons</p>
      <GenreTags genres={podcast.genres} />
      <p className={styles.updatedText}>Updated {formatDate(podcast.updated)}</p>
    </div>
  );
}
