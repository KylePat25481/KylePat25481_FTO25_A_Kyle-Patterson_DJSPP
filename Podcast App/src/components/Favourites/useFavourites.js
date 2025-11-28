// src/hooks/useFavourites.js
import { useState, useEffect } from "react";

const STORAGE_KEY = "djs_favourites_v1";

export function useFavourites() {
  const [favourites, setFavourites] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {}
  }, [favourites]);

  const toggle = (episode, podcastMeta = {}) => {
    setFavourites((prev) => {
      const exists = prev.find((e) => e.id === episode.id);
      if (exists) {
        return prev.filter((e) => e.id !== episode.id);
      }

      const payload = {
        id: episode.id,
        title: episode.title || "Untitled Episode",
        audio: episode.audio || episode.enclosure || episode.file || "",
        image: episode.image || episode.thumbnail || podcastMeta.image || "",
        podcastId: podcastMeta.id || episode.podcastId || "unknown",
        podcastTitle: podcastMeta.title || episode.podcastTitle || "Unknown Show",
        podcastImage: podcastMeta.image || episode.podcastImage || "",
        podcastGenres: podcastMeta.genres || episode.podcastGenres || [],
        season: episode.season ?? episode.season_number ?? "",
        number: episode.number ?? episode.episode ?? "",
        addedAt: new Date().toISOString(),
      };

      return [...prev, payload];
    });
  };

  const isFavourited = (episode) => favourites.some((e) => e.id === episode.id);

  return { favourites, toggle, isFavourited, setFavourites };
}
