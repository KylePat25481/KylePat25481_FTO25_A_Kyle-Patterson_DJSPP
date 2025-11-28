import { Routes, Route } from "react-router-dom";
import Header from "./components/UI/Header";
import Home from "./pages/Home";
import ShowDetail from "./pages/ShowDetail";
import FavouritesPage from "./pages/Favourites";
import { PodcastProvider } from "./context/PodcastContext";
import { PlayerProvider } from "./components/AudioPlayer/PlayerProvider";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";

export default function App() {
  return (
    <>
      <Header />
      <PlayerProvider>
        <PodcastProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/show/:id" element={<ShowDetail />} />
            <Route path="/favourites" element={<FavouritesPage />} />
          </Routes>
          <AudioPlayer />
        </PodcastProvider>
      </PlayerProvider>
    </>
  );
}
