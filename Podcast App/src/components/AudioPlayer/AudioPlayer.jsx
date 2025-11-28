import { useEffect } from "react";
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

  // Helper to format seconds into mm:ss
  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Prompt user before leaving if audio is playing
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isPlaying]);

  if (!currentEpisode) return null;

  return (
    <div className={styles.playerWrapper}>
      {/* LEFT – Artwork + Titles */}
      <div className={styles.left}>
        <img src={currentEpisode.image} alt="" className={styles.art} />
        <div className={styles.meta}>
          <div className={styles.episodeTitle}>{currentEpisode.title}</div>
          <div className={styles.showTitle}>{currentEpisode.showTitle}</div>
        </div>
      </div>

      {/* CENTER – Player Controls */}
      <div className={styles.center}>
        <button className={styles.iconButton} onClick={() => seek(progress - 10)}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M11 18V6L3 12Zm1-6l8 6V6Z" />
          </svg>
        </button>

        <button className={styles.playButton} onClick={togglePlay}>
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M6 19h4V5H6Zm8-14v14h4V5Z" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24">
              <path fill="currentColor" d="m8 5 12 7-12 7Z" />
            </svg>
          )}
        </button>

        <button className={styles.iconButton} onClick={() => seek(progress + 10)}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="currentColor" d="M13 6v12l8-6Zm-1 6L4 6v12Z" />
          </svg>
        </button>
      </div>

      {/* RIGHT – Progress bar + Volume + Queue */}
      <div className={styles.right}>
        {/* Time display */}
        <div className={styles.time}>
          {formatTime(progress)} / {formatTime(duration)}
        </div>

        <input
          type="range"
          className={styles.progress}
          min={0}
          max={duration || 0}
          value={progress}
          onChange={(e) => seek(Number(e.target.value))}
        />

        <div className={styles.volumeWrapper}>
          <button className={styles.iconButton}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M5 15v-6h4l5-4v14l-5-4Zm10.54-.46L18 17m-2.46-9L18 7"
              />
            </svg>
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className={styles.volumeSlider}
          />
        </div>

        <button className={styles.iconButton}>
          <svg width="22" height="22" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 6h18v2H3Zm0 5h12v2H3Zm0 5h18v2H3Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
