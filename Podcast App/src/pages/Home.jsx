import { useState, useContext } from "react";
import { SearchBar, SortSelect, GenreFilter, PodcastGrid, Pagination, Loading, Error } from "../components";
import Carousel from "../components/Carousel/Carousel";
import PodcastDetail from "../components/Podcasts/PodcastDetail";
import { genres } from "../data";
import { PodcastContext } from "../context/PodcastContext";
import { Helmet } from "react-helmet"; // <-- Import Helmet
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
      {/* Helmet for SEO and social media previews */}
      <Helmet>
        <title> Podcast App – Browse Shows & Episodes</title>
        <meta
          name="description"
          content="Discover, listen, and favourite your favourite podcasts and episodes."
        />
        {/* Open Graph */}
        <meta property="og:title" content=" Podcast App – Browse Shows & Episodes" />
        <meta
          property="og:description"
          content="Discover, listen, and favourite your favourite podcasts and episodes."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta property="og:image" content="%PUBLIC_URL%/og-image.png" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content=" Podcast App – Browse Shows & Episodes" />
        <meta
          name="twitter:description"
          content="Discover, listen, and favourite your favourite podcasts and episodes."
        />
        <meta name="twitter:image" content="%PUBLIC_URL%/og-image.png" />
      </Helmet>

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
