import React, { useEffect, useState, useMemo } from "react";
import { usePlayer } from "../components/AudioPlayer/PlayerProvider";
import GenreTags from "../components/UI/GenreTags";
import styles from "./Favourites.module.css";

const STORAGE_KEY = "djs_favourites_v1";

/**
 * useFavourites - manages favorites persisted in localStorage.
 * Each favourite item shape:
 * {
 *   id,
 *   title,
 *   audio,
 *   image,
 *   description,
 *   podcastId,
 *   podcastTitle,
 *   podcastImage,
 *   podcastGenres, // optional
 *   season,
 *   number,
 *   addedAt
 * }
 */
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

  // Toggle favourite: if it exists remove, otherwise add with metadata + timestamp
  const toggle = (episode, podcastMeta = {}) => {
    setFavourites((prev) => {
      const exists = prev.find((e) => e.id === episode.id);
      if (exists) return prev.filter((e) => e.id !== episode.id);

      // Build favourite payload with podcast metadata (so grouping can show image/title/genres)
      const payload = {
        id: episode.id,
        title: episode.title || episode.name || "Untitled Episode",
        audio: episode.audio || episode.enclosure || episode.file || "",
        image: episode.image || episode.thumbnail || episode.itunes_image || podcastMeta.image || "",
        description: episode.description || episode.summary || "",
        podcastId: podcastMeta.id || episode.podcastId || podcastMeta.podcastId || "unknown",
        podcastTitle: podcastMeta.title || episode.podcastTitle || podcastMeta.podcastTitle || "Unknown Show",
        podcastImage: podcastMeta.image || episode.podcastImage || podcastMeta.podcastImage || "",
        podcastGenres: podcastMeta.genres || episode.podcastGenres || [],
        season: episode.season || episode.season_number || "",
        number: episode.number || episode.episode || "",
        addedAt: new Date().toISOString(),
      };

      return [...prev, payload];
    });
  };

  const isFavourited = (episode) => favourites.some((e) => e.id === episode.id);

  return { favourites, toggle, isFavourited, setFavourites };
}

export default function FavouritesPage() {
  const { favourites, toggle, isFavourited } = useFavourites();
  const player = usePlayer();

  // UI sorting state
  const [sortByDate, setSortByDate] = useState("newest"); // newest | oldest
  const [sortByTitle, setSortByTitle] = useState("none"); // none | asc | desc
  const [filterShow, setFilterShow] = useState("all");

  // Group favourites by podcastId so we render podcast cards with nested episodes
  const grouped = useMemo(() => {
    const map = {};
    for (const ep of favourites) {
      const key = ep.podcastId || ep.podcastTitle || "unknown";
      if (!map[key]) {
        map[key] = {
          podcastId: key,
          podcastTitle: ep.podcastTitle || "Unknown Show",
          podcastImage: ep.podcastImage || ep.podcastImage || ep.image || "",
          podcastGenres: ep.podcastGenres || [],
          episodes: [],
        };
      }
      map[key].episodes.push(ep);
    }

    // Apply sorts within each group
    for (const key of Object.keys(map)) {
      const group = map[key];

      // sort by date added first (stable)
      group.episodes.sort((a, b) => {
        if (sortByDate === "newest") return new Date(b.addedAt) - new Date(a.addedAt);
        return new Date(a.addedAt) - new Date(b.addedAt);
      });

      // then sort by title if selected
      if (sortByTitle === "asc") {
        group.episodes.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortByTitle === "desc") {
        group.episodes.sort((a, b) => b.title.localeCompare(a.title));
      }
    }

    return Object.values(map);
  }, [favourites, sortByDate, sortByTitle]);

  // Filtered groups optionally by show
  const filteredGroups = useMemo(() => {
    if (filterShow === "all") return grouped;
    return grouped.filter((g) => g.podcastId === filterShow || g.podcastTitle === filterShow);
  }, [grouped, filterShow]);

  // Build options for show filter
  const showOptions = useMemo(() => {
    return grouped.map((g) => ({ id: g.podcastId, title: g.podcastTitle }));
  }, [grouped]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Favourite Episodes</h1>
          <p className={styles.sub}>Your saved episodes from all shows</p>
        </div>

        <div className={styles.controlsRow}>
          <label className={styles.control}>
            Sort by:
            <select className={styles.select} value={sortByDate} onChange={(e) => setSortByDate(e.target.value)}>
              <option value="newest">Newest Added</option>
              <option value="oldest">Oldest Added</option>
            </select>
          </label>

          <label className={styles.control}>
            Title:
            <select className={styles.select} value={sortByTitle} onChange={(e) => setSortByTitle(e.target.value)}>
              <option value="none">—</option>
              <option value="asc">A → Z</option>
              <option value="desc">Z → A</option>
            </select>
          </label>

          <label className={styles.control}>
            Show:
            <select className={styles.select} value={filterShow} onChange={(e) => setFilterShow(e.target.value)}>
              <option value="all">All Shows</option>
              {showOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {filteredGroups.length === 0 && (
          <div className={styles.empty}>
            <p>No favourites yet — click the heart on episodes to save them here.</p>
          </div>
        )}

        {filteredGroups.map((group) => (
          <div key={group.podcastId} className={styles.podcastGroup}>
            <div className={styles.podcastHeader}>
              <img src={group.podcastImage || "/placeholder-cover.png"} alt={group.podcastTitle} className={styles.podcastCover} />
              <div className={styles.podcastMeta}>
                <h3 className={styles.podcastTitle}>
                  {group.podcastTitle} <span className={styles.count}>({group.episodes.length} episodes)</span>
                </h3>
                <GenreTags genres={group.podcastGenres || []} />
              </div>
            </div>

            <div className={styles.episodeList}>
              {group.episodes.map((ep) => (
                <div key={ep.id} className={styles.episodeRow}>
                  <div className={styles.episodeLeft}>
                    <div className={styles.thumb}>
                      <img src={ep.image || group.podcastImage || "/placeholder-cover.png"} alt={ep.title} />
                    </div>

                    <div className={styles.episodeInfo}>
                      <div className={styles.epTitleRow}>
                        <h4 className={styles.epTitle}>{ep.title}</h4>
                        <button
                          className={`${styles.heartBtn} ${isFavourited(ep) ? styles.heartActive : ""}`}
                          onClick={() => toggle(ep, { id: group.podcastId, title: group.podcastTitle, image: group.podcastImage, genres: group.podcastGenres })}
                          aria-label={isFavourited(ep) ? "Remove favourite" : "Add favourite"}
                          title={isFavourited(ep) ? "Remove from favourites" : "Add to favourites"}
                        >
                          ♥
                        </button>
                      </div>

                      <div className={styles.epMeta}>
                        <span className={styles.seasonInfo}>
                          {ep.season ? `Season ${ep.season}` : ""} {ep.number ? `• Episode ${ep.number}` : ""}
                        </span>
                        <p className={styles.epDesc}>{ep.description}</p>
                        <div className={styles.addedAt}>Added on {new Date(ep.addedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.episodeActions}>
                    <button
                      className={styles.playBtn}
                      onClick={() =>
                        player.playEpisode({
                          title: ep.title,
                          image: ep.image || group.podcastImage,
                          audio: ep.audio,
                        })
                      }
                    >
                      ▶ Play
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* add a spacer so fixed bottom player doesn't overlap content */}
        <div className={styles.playerSpacer} />
      </div>
    </div>
  );
}
