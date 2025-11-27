import { useState, useContext } from "react";
import { SearchBar, SortSelect, GenreFilter, PodcastGrid, Pagination, Loading, Error } from "../components";
import Carousel from "../components/Carousel/Carousel";
import PodcastDetail from "../components/Podcasts/PodcastDetail";
import { genres } from "../data";
import { PodcastContext } from "../context/PodcastContext";
import styles from "./Home.module.css";

export default function Home() {
  const { podcasts, loading, error } = useContext(PodcastContext);

  const [selectedPodcast, setSelectedPodcast] = useState(null);

  const handleOpenPodcast = (podcast) => {
    setSelectedPodcast(podcast);
  };
  const handleClosePodcast = () => setSelectedPodcast(null);

  return (
    <main className={styles.main}>
      <section className={styles.controls}>
        <SearchBar />
        <GenreFilter genres={genres} />
        <SortSelect />
      </section>

      {loading && <Loading message="Loading podcasts..." />}
      {error && <Error message={`Error occurred while fetching podcasts: ${error}`} />}

      {!loading && !error && (
        <>
          <Carousel
            items={podcasts.slice(0, 8)}
            onClickItem={handleOpenPodcast} // opens ShowDetail
          />

          <PodcastGrid />
          <Pagination />
        </>
      )}

      {selectedPodcast && (
        <PodcastDetail
          podcast={selectedPodcast}
          genres={genres}
          onBack={handleClosePodcast}
        />
      )}
    </main>
  );
}
