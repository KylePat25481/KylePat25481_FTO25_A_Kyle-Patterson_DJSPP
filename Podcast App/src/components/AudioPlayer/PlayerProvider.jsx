// src/components/AudioPlayer/PlayerProvider.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

const PlayerContext = createContext(null);
export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());

  const placeholderEpisode = {
    title: "Sample Episode",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    image: "https://via.placeholder.com/150",
  };

  const [currentEpisode, setCurrentEpisode] = useState(placeholderEpisode);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  // OPTIONAL: If you later want playlist support, set this to an array of episodes
  const [playlist, setPlaylist] = useState([]); // array of episodes
  const [playlistIndex, setPlaylistIndex] = useState(-1); // -1 means none

  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onLoaded = () => setDuration(isFinite(audio.duration) ? audio.duration : 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      // auto-advance if playlist available
      if (playlist.length && playlistIndex >= 0) {
        const nextIndex = playlistIndex + 1;
        if (nextIndex < playlist.length) {
          playEpisode(playlist[nextIndex], nextIndex);
        }
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    // set initial src
    audio.src = placeholderEpisode.audio;

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Normalize and play an episode.
  // If the optional index argument is provided, it will set playlistIndex.
const playEpisode = (episode, index = -1, optionalPlaylist = null) => {
  if (!episode || !episode.audio) {
    console.warn("Episode missing audio, skipping");
    return;
  }

  // Normalize episode data and add all fields expected by AudioPlayer
  const normalized = {
    title: episode.title || "Untitled Episode",
    audio: episode.audio || episode.enclosure || episode.file || placeholderEpisode.audio,
    image: episode.image || episode.showImage || placeholderEpisode.image,
    showTitle: episode.showTitle || episode.showTitle || "Unknown Show",
    season: episode.season ?? null,
    number: episode.number ?? null,
  };

  setCurrentEpisode(normalized);
  audioRef.current.src = normalized.audio;

  // If an optional playlist array is passed in, set it and the index
  if (Array.isArray(optionalPlaylist)) {
    setPlaylist(optionalPlaylist);
    setPlaylistIndex(index);
  } else if (index >= 0) {
    setPlaylistIndex(index);
  }

  setTimeout(() => {
    audioRef.current.play().catch((e) => console.warn("Autoplay blocked", e));
  }, 50);
};


  const play = () => audioRef.current.play();
  const pause = () => audioRef.current.pause();
  const togglePlay = () => (isPlaying ? pause() : play());

  const seek = (time) => {
    const t = Math.max(0, Math.min(time, duration || 0));
    audioRef.current.currentTime = t;
    setProgress(t);
  };

  // seek relative: positive seconds -> forward, negative -> backward
  const seekBy = (seconds) => {
    const current = audioRef.current.currentTime || 0;
    const target = Math.max(0, Math.min(current + seconds, duration || 0));
    audioRef.current.currentTime = target;
    setProgress(target);
  };

  // Skip to next/previous track in playlist (if available).
  const skipNext = () => {
    if (playlist.length && playlistIndex >= 0) {
      const next = playlistIndex + 1;
      if (next < playlist.length) {
        playEpisode(playlist[next], next);
        return;
      }
    }
    console.log("skipNext: no next track in playlist");
  };

  const skipPrev = () => {
    if (playlist.length && playlistIndex >= 0) {
      const prev = playlistIndex - 1;
      if (prev >= 0) {
        playEpisode(playlist[prev], prev);
        return;
      }
    }
    // if within current track, rewind to start
    seek(0);
    console.log("skipPrev: no prev track in playlist; rewound to 0");
  };

  const value = {
    currentEpisode,
    isPlaying,
    progress,
    duration,
    togglePlay,
    play,
    pause,
    seek,
    seekBy,
    skipNext,
    skipPrev,
    volume,
    setVolume,
    playEpisode,
    audioRef,
    // playlist controls (exposed so UI or higher-level logic can set playlist)
    playlist,
    setPlaylist,
    playlistIndex,
    setPlaylistIndex,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}
