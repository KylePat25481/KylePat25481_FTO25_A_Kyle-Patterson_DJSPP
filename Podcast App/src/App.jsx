// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Header from "./components/UI/Header";
import Home from "./pages/Home";
import ShowDetail from "./pages/ShowDetail";
import { PodcastProvider } from "./context/PodcastContext";

import { PlayerProvider } from "./components/AudioPlayer/PlayerProvider";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import FavouritesPage from "./pages/Favourites";

/**
 * Root component — PlayerProvider is outer so audio persists across routes.
 */
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

          {/* Fixed player at bottom — placed inside PlayerProvider so it can access context */}
          <AudioPlayer />
        </PodcastProvider>
      </PlayerProvider>
    </>
  );
}
