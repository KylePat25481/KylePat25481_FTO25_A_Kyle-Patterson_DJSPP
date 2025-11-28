import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/UI/Header";
import Home from "./pages/Home";
import ShowDetail from "./pages/ShowDetail";
import { PodcastProvider } from "./context/PodcastContext";

import { PlayerProvider } from "./components/AudioPlayer/PlayerProvider";
import AudioPlayer from "./components/AudioPlayer/AudioPlayer";
import FavouritesPage from "./pages/Favourites";

export default function App() {
  const location = useLocation();

  // Hide header on podcast detail page
  const hideHeader = location.pathname.startsWith("/show/");

  return (
    <>
      {!hideHeader && <Header />}
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
