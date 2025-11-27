// src/pages/ShowDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchSinglePodcast } from "../api/fetchData";
import { Loading, Error } from "../components";
import PodcastDetail from "../components/Podcasts/PodcastDetail";
import { usePlayer } from "../components/AudioPlayer/PlayerProvider";
import { useFavourites } from "../components/Favourites/useFavourites";

export default function ShowDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { genres } = location.state || {};
  const navigate = useNavigate();

  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const player = usePlayer();
  const favs = useFavourites();

  useEffect(() => {
    setLoading(true);
    fetchSinglePodcast(id, setPodcast, setError, setLoading);
  }, [id]);

  if (loading) return <Loading message="Loading podcast..." />;
  if (error) return <Error message={`Error occurred while fetching podcast: ${error}`} />;

const handlePlayEpisode = (episode, episodeIndex, seasonIndex) => {
  if (!episode) return;

  player.playEpisode({
    title: episode.title,
    audio: episode.audio || episode.enclosure || episode.file,
    image: episode.image || podcast.image,
    showTitle: podcast.title,
    season: seasonIndex + 1,
    number: episodeIndex + 1,
  });
};


  return (
    <PodcastDetail
      podcast={podcast}
      genres={genres}
      onBack={() => navigate(-1)}
      onPlayEpisode={handlePlayEpisode}
      onToggleFavourite={(payload) => favs.toggle(payload)}
      isFavourited={favs.isFavourited}
    />
  );
}
