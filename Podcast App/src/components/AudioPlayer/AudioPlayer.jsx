import { usePlayer } from "./PlayerProvider";
import styles from "./AudioPlayer.module.css";

export default function AudioPlayer() {
  const {
    currentEpisode,
    isPlaying,
    togglePlay,
    progress,
    duration,
    seek,
    volume,
    setVolume,
  } = usePlayer();

  if (!currentEpisode) return null;

  return (
    <div className={styles.playerWrapper} data-theme={document.documentElement.dataset.theme}>
      {/* LEFT: cover + titles */}
      <div className={styles.left}>
        <img src={currentEpisode.image} alt={currentEpisode.title} className={styles.art} />
        <div className={styles.meta}>
          <div className={styles.episodeTitle}>{currentEpisode.title}</div>
          <div className={styles.showTitle}>{currentEpisode.showTitle}</div>
        </div>
      </div>

      {/* CENTER: controls + progress */}
      <div className={styles.center}>
        <div className={styles.controls}>
          <button onClick={() => seek(progress - 10)}>⏪</button>
          <button onClick={togglePlay}>{isPlaying ? "⏸" : "▶"}</button>
          <button onClick={() => seek(progress + 10)}>⏩</button>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={(e) => seek(Number(e.target.value))}
          className={styles.progress}
        />
      </div>

      {/* RIGHT: volume + theme */}
      <div className={styles.right}>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className={styles.volume}
        />
      </div>
    </div>
  );
}
