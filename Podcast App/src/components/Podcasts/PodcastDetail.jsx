import { useState } from "react";
import styles from "./PodcastDetail.module.css";
import { formatDate } from "../../utils/formatDate";
import GenreTags from "../UI/GenreTags";
import Carousel from "../Carousel/Carousel";

export default function PodcastDetail({
  podcast,
  genres,
  recommendedPodcasts = [],
  onBack,
  onPlayEpisode,
  onToggleFavourite,
  isFavourited,
}) {
  const [selectedSeasonIndex, setSelectedSeasonIndex] = useState(0);
  const season = podcast.seasons[selectedSeasonIndex];

  const handleClickRecommended = (item) => {
    console.log("Clicked recommended show:", item.title);
  };

  return (
    <div className={styles.container}>
      <button className={styles.backButton} onClick={onBack}>
        ← Back
      </button>

      <div className={styles.header}>
        <img src={podcast.image} alt="Podcast Cover" className={styles.cover} />
        <div>
          <h1 className={styles.title}>{podcast.title}</h1>
          <p className={styles.description}>{podcast.description}</p>
          <div className={styles.metaInfo}>
            <div className={styles.seasonInfo}>
              <div>
                <p>Genres</p>
                <GenreTags genres={genres || podcast.genres} />
              </div>
              <div>
                <p>Last Updated:</p>
                <strong>{formatDate(podcast.updated)}</strong>
              </div>
              <div>
                <p>Total Seasons:</p>
                <strong>{podcast.seasons.length} Seasons</strong>
              </div>
              <div>
                <p>Total Episodes:</p>
                <strong>
                  {podcast.seasons.reduce((acc, s) => acc + s.episodes.length, 0)} Episodes
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.seasonDetails}>
        <div className={styles.seasonIntro}>
          <div className={styles.left}>
            <img className={styles.seasonCover} src={season.image} alt="" />
            <div>
              <h3>
                Season {selectedSeasonIndex + 1}: {season.title}
              </h3>
              <p>{season.description}</p>
              <p className={styles.releaseInfo}>{season.episodes.length} Episodes</p>
            </div>
          </div>
          <select
            value={selectedSeasonIndex}
            onChange={(e) => setSelectedSeasonIndex(Number(e.target.value))}
            className={styles.dropdown}
          >
            {podcast.seasons.map((s, i) => (
              <option key={i} value={i}>
                Season {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.episodeList}>
          {season.episodes.map((ep, index) => {
            const payload = {
              id: ep.id || `${podcast.id}_s${selectedSeasonIndex}_e${index}`,
              title: ep.title,
              audio: ep.audio || ep.file || ep.enclosure,
              image: ep.image || podcast.image,
              podcastId: podcast.id,
              podcastTitle: podcast.title,
              podcastImage: podcast.image,
              season: selectedSeasonIndex + 1,
              number: index + 1,
              addedAt: new Date().toISOString(),
            };

            return (
              <div key={payload.id} className={styles.episodeCard}>
                <img className={styles.episodeCover} src={payload.image} alt={payload.title} />
                <div className={styles.episodeInfo}>
                  <p className={styles.episodeTitle}>
                    Episode {index + 1}: {ep.title}
                  </p>
                  <p className={styles.episodeDesc}>{ep.description}</p>
                </div>

                <div
                  style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}
                >
                  <button onClick={() => onPlayEpisode && onPlayEpisode(payload)}>
                    ▶ Play
                  </button>

                  <button onClick={() => onToggleFavourite && onToggleFavourite(payload)}>
                    {isFavourited && isFavourited(payload) ? "♥" : "♡"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {recommendedPodcasts.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Recommended Shows</h2>
          <Carousel items={recommendedPodcasts} onClickItem={handleClickRecommended} />
        </div>
      )}
    </div>
  );
}
