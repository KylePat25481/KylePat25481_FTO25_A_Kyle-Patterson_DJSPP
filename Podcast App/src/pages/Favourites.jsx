import React, { useMemo, useState } from "react";
import { usePlayer } from "../components/AudioPlayer/PlayerProvider";
import { useFavourites } from "../components/Favourites/useFavourites";
import styles from "./Favourites.module.css";

export default function Favourites() {
  const { favourites, toggle, isFavourited } = useFavourites();
  const player = usePlayer();

  const [sort, setSort] = useState("newest");
  const [showFilter, setShowFilter] = useState("all");

  // Group by podcast
  const grouped = useMemo(() => {
    const map = {};
    favourites.forEach((ep) => {
      const podcastId = ep.podcastId || "unknown";
      const podcastTitle = ep.podcastTitle || "Unknown Show";
      const podcastImage = ep.podcastImage || ep.image || "/placeholder-cover.png";

      if (!map[podcastId]) {
        map[podcastId] = {
          podcastId,
          podcastTitle,
          podcastImage,
          episodes: [],
        };
      }
      map[podcastId].episodes.push(ep);
    });

    // Sort episodes within each group
    Object.values(map).forEach((group) => {
      group.episodes.sort((a, b) =>
        sort === "newest"
          ? new Date(b.addedAt) - new Date(a.addedAt)
          : new Date(a.addedAt) - new Date(b.addedAt)
      );
    });

    return Object.values(map);
  }, [favourites, sort]);

  const filteredGroups =
    showFilter === "all"
      ? grouped
      : grouped.filter((g) => g.podcastId === showFilter);

  const handleToggleFavourite = (ep, group) => {
    toggle(ep, {
      id: group?.podcastId,
      title: group?.podcastTitle,
      image: group?.podcastImage,
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.heading}>Favourite Episodes</h1>
          <p className={styles.sub}>Your saved episodes from all shows</p>
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.control}>
            Sort by:
            <select
              className={styles.select}
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest Added</option>
              <option value="oldest">Oldest Added</option>
            </select>
          </div>

          <div className={styles.control}>
            Show:
            <select
              className={styles.select}
              value={showFilter}
              onChange={(e) => setShowFilter(e.target.value)}
            >
              <option value="all">All Shows</option>
              {grouped.map((g) => (
                <option key={g.podcastId} value={g.podcastId}>
                  {g.podcastTitle}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        {!favourites.length ? (
          <div className={styles.empty}>
            No favourites yet. Tap the heart on any episode to save it!
          </div>
        ) : (
          filteredGroups.map((group) => (
            <div className={styles.podcastGroup} key={group.podcastId}>
              <details open>
                <summary className={styles.podcastHeader}>
                  <img
                    src={group.podcastImage}
                    alt={group.podcastTitle}
                    className={styles.podcastCover}
                  />
                  <div className={styles.podcastMeta}>
                    <span className={styles.podcastTitle}>
                      {group.podcastTitle}
                      <span className={styles.count}>
                        ({group.episodes.length} episodes)
                      </span>
                    </span>
                  </div>
                </summary>

                <div className={styles.episodeList}>
                  {group.episodes.map((ep) => (
                    <div key={ep.id} className={styles.episodeRow}>
                      <div className={styles.episodeLeft}>
                        <div className={styles.thumb}>
                          <img
                            src={ep.image || group.podcastImage}
                            alt={ep.title}
                          />
                        </div>

                        <div className={styles.episodeInfo}>
                          <h4 className={styles.epTitle}>{ep.title}</h4>
                          <p className={styles.epMeta}>
                            {ep.season && `Season ${ep.season} • `}
                            {ep.number && `Episode ${ep.number}`}
                            <br />
                            Added on {new Date(ep.addedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className={styles.episodeActions}>
                        <button
                          className={`${styles.heartBtn} ${
                            isFavourited(ep) ? styles.heartActive : ""
                          }`}
                          onClick={() => handleToggleFavourite(ep, group)}
                        >
                          ♥
                        </button>
                        <button
                          className={styles.playBtn}
                          onClick={() => player.playEpisode(ep)}
                        >
                          ▶ Play
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))
        )}
      </div>

      <div className={styles.playerSpacer}></div>
    </div>
  );
}
