import React, { useState, useEffect } from "react";
import "../App.css";
import godofwar from "../images/photo/godofwar.jpg";
import lastofus from "../images/photo/lastofus.jpg";
import cyberpunk from "../images/photo/cyberpunk.jpg";
import witcher3 from "../images/photo/witcher3.webp";
import eldenring from "../images/photo/eldenring.jpg";
import rdr2 from "../images/photo/rdr2.webp";
import horizonfw from "../images/photo/horizonfw.webp";
import ghostoftsushima from "../images/photo/ghostoftsushima.webp";
import darksouls3 from "../images/photo/darksouls3.webp";
import valhalla from "../images/photo/valhalla.webp";
import gta5 from "../images/photo/gta5.webp";
import farcry6 from "../images/photo/farcry6.webp";
import Resident from "../images/photo/resident.jpg";
import deathstran from "../images/photo/deathstran.jpg";
import sekiro from "../images/photo/sekiro.webp";
import codmw2 from "../images/photo/codmw2.webp";
import bf2042 from "../images/photo/bf2042.webp";
import over2 from "../images/photo/over2.jpg";
import valorant from "../images/photo/valorant.webp";
import minecraft from "../images/photo/minecraft.webp";
import fortnite from "../images/photo/fornite.webp";
import cs2 from "../images/photo/cs2.webp";


import { getAuth, onAuthStateChanged } from "firebase/auth";


import Header from "../components/Header";
import VideoCart from "../components/VideoCart";
import GameSlider from "../components/GameSlider";
import GameCatalog from "../components/GameCatalog";
import Recommendations from "../components/Recommendations";
import Footer from "../components/Footer";

function Home({ setIsAuthenticated } ) {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);
  const [gameTitle, setGameTitle] = useState("");
  const [recommendations, setRecommendations] = useState(
    JSON.parse(localStorage.getItem("recommendations")) || []
  );

  const sliderGames = [
    { title: "God of War", genre: "Экшен, мифология", img: godofwar },
    { title: "The Last of Us", genre: "Выживание, драма", img: lastofus },
    { title: "Cyberpunk 2077", genre: "Футуристический экшен-RPG", img: cyberpunk },
    { title: "Battlefield 2042", genre: "Тактический Шутер", img: bf2042},
    { title: "Fortnite", genre: "Баттл-рояль, Шутер", img: fortnite}
  ];
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  function deleteRecommendation(index) {
    const updated = [...recommendations];
    updated.splice(index, 1);
    setRecommendations(updated);
  }

const catalogGames = [
  { title: "The Witcher 3: Wild Hunt", genre: "RPG", img: witcher3, description: "Фэнтезийная ролевая игра с захватывающим сюжетом и открытым миром." },
  { title: "Elden Ring", genre: "Souls-like", img: eldenring, description: "Новая souls-like игра от FromSoftware в открытом мире." },
  { title: "Red Dead Redemption 2", genre: "Открытый мир", img: rdr2, description: "Эпическая история в стиле вестерн с детализированным открытым миром." },
  { title: "Horizon Forbidden West", genre: "Приключения", img: horizonfw, description: "Приключенческий экшен в постапокалиптическом мире с роботами." },
  { title: "Ghost of Tsushima", genre: "Экшен", img: ghostoftsushima, description: "Самурайский экшен с элементами скрытности и открытым миром." },
  { title: "Dark Souls III", genre: "Souls-like", img: darksouls3, description: "Сложный боевой геймплей и тёмное фэнтези." },
  { title: "Assassin's Creed Valhalla", genre: "Приключения", img: valhalla, description: "Ролевая игра во времена викингов с масштабными сражениями." },
  { title: "Cyberpunk 2077", genre: "RPG", img: cyberpunk, description: "Футуристический город, импланты, выборы и последствия." },
  { title: "GTA V", genre: "Открытый мир", img: gta5, description: "Грандиозный криминальный экшен в открытом мире Лос-Сантоса." },
  { title: "Far Cry 6", genre: "Шутер", img: farcry6, description: "Ведите революцию против диктатора в жарком тропическом раю." },
  { title: "Resident Evil Village", genre: "Хоррор", img: Resident, description: "Ужасающий хоррор с элементами выживания и исследования." },
  { title: "Death Stranding", genre: "Приключения", img: deathstran, description: "Уникальный симулятор доставки в постапокалиптической Америке." },
  { title: "Sekiro: Shadows Die Twice", genre: "Souls-like", img: sekiro , description: "Самурайская souls-like игра с упором на парирование и стелс." },
  { title: "Call of Duty: Modern Warfare II", genre: "Шутер", img: codmw2, description: "Современные военные действия с кинематографичной кампанией." },
  { title: "Battlefield 2042", genre: "Шутер", img: bf2042, description: "Масштабные сражения с техникой и разрушениями будущего." },
  { title: "Overwatch 2", genre: "Шутер", img: over2, description: "Командный шутер с яркими героями и уникальными способностями." },
  { title: "Valorant", genre: "Шутер", img: valorant, description: "Тактический шутер с агентами и умениями в стиле CS:GO + магия." },
  { title: "Minecraft", genre: "Песочница", img: minecraft, description: "Бесконечные возможности креатива и выживания в кубическом мире." },
  { title: "Fortnite", genre: "Шутер", img: fortnite, description: "Баттл-рояль с постройкой и сезонными обновлениями." },
  { title: "Counter-Strike 2", genre: "Шутер", img: cs2, description: "Тактический шутер с соревновательными матчами и обновлённой графикой на движке Source 2."}
];



  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("recommendations", JSON.stringify(recommendations));
  }, [recommendations]);

  useEffect(() => {
    const filtered = catalogGames.filter((game) =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredGames(filtered);
  }, [searchQuery]);

  function addRecommendation(newRec) {
  setRecommendations([...recommendations, newRec]);
}


  return (
    <>    
    <Header theme={theme} setTheme={setTheme} setIsAuthenticated={setIsAuthenticated} />

      <VideoCart />
      <GameSlider sliderGames={sliderGames} />
      <GameCatalog
        filteredGames={filteredGames}
      setFilteredGames={setFilteredGames}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}

      />
      <Recommendations
        recommendations={recommendations}
        gameTitle={gameTitle}
        setGameTitle={setGameTitle}
        addRecommendation={addRecommendation}
        deleteRecommendation={deleteRecommendation}
      currentUser={currentUser}
      games={filteredGames}
      />
      <Footer />
    </>
  );
}

export default Home;
