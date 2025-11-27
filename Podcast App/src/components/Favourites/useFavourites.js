// src/components/Favourites/useFavourites.js
import { useEffect, useState } from "react";

const STORAGE_KEY = "djs_favourites_v1";

/**
 * useFavourites keeps a list of favourited episodes in localStorage.
 * Each item shape:
 * { episodeId, title, showId, showTitle, seasonIndex, dateAdded (ISO), extra }
 */
export function useFavourites() {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const add = (fav) => {
    const now = new Date().toISOString();
    setItems((prev) => {
      if (prev.some((p) => p.episodeId === fav.episodeId)) return prev;
      return [{ ...fav, dateAdded: now }, ...prev];
    });
  };

  const remove = (episodeId) => {
    setItems((prev) => prev.filter((i) => i.episodeId !== episodeId));
  };

  const toggle = (fav) => {
    if (items.some((i) => i.episodeId === fav.episodeId)) remove(fav.episodeId);
    else add(fav);
  };

  const isFavourited = (episodeId) => items.some((i) => i.episodeId === episodeId);

  const clearAll = () => setItems([]);

  return { items, add, remove, toggle, isFavourited, clearAll, setItems };
}
