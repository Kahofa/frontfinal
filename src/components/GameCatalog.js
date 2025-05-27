import React, { useState, useMemo } from "react";
const ADMIN_UID = "7VzvPFT2oHW5e284LxfYJBkE1AC3";
function Catalog({
  filteredGames,
  setFilteredGames,
  searchQuery,
  setSearchQuery,
  currentUser = "admin",
}) {
  const isAdmin = currentUser?.uid === ADMIN_UID;
console.log("Проверка UID", currentUser?.uid, ADMIN_UID);

  console.log("currentUser", currentUser);
  const [sortOption, setSortOption] = useState("default");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [visibleCount, setVisibleCount] = useState(4);
  const [newGame, setNewGame] = useState({ title: "", genre: "", img: "" });
  const [ratings, setRatings] = useState({});
  const allGenres = useMemo(() => {
    const genres = filteredGames.map((game) => game.genre);
    return ["all", ...new Set(genres)];
  }, [filteredGames]);

  const sortedAndFilteredGames = useMemo(() => {
    let games = [...filteredGames];
    if (selectedGenre !== "all") {
      games = games.filter((game) => game.genre === selectedGenre);
    }
    if (sortOption === "alpha") {
      games.sort((a, b) => a.title.localeCompare(b.title));
    }
    return games;
  }, [filteredGames, sortOption, selectedGenre]);

  const handleAddGame = () => {
    if (newGame.title.trim() && newGame.genre.trim() && newGame.img.trim()) {
      setFilteredGames([...filteredGames, newGame]);
      setNewGame({ title: "", genre: "", img: "" });
    }
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleHide = () => {
    setVisibleCount(4);
  };

  const displayedGames = sortedAndFilteredGames.slice(0, visibleCount);
  const handleRatingChange = (index, rating) => {
    setRatings((prev) => ({...prev, [index]:rating,}));
  };

  const renderStars = (index) => {
    const rating = ratings[index] || 0;
    return [...Array(5)].map((_, starIndex) => {
      const starNumber = starIndex + 1;
      return (
        <span 
          key={starIndex}
          style={{
            cursor: "pointer",
            color: starNumber <= rating ? "gold" : "gray",
            fontSize: "20px",
            userSelect: "none",
          }}
          onClick={() => handleRatingChange(index, starNumber)}
          role="button"
          aria-label={`${starNumber} stars`}
        >
          ★
        </span>
      );
    });
  };

  return (
    <div id="catalog" className="basic-section">
      <div className="service-container">
        <h2 className="popular-game">Популярные игры</h2>

        <input
          type="text"
          placeholder="Поиск игр..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="filter-select"
        >
          {allGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre === "all" ? "Все жанры" : genre}
            </option>
          ))}
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="sort-select"
        >
          <option value="default">Без сортировки</option>
          <option value="alpha">По алфавиту</option>
          
        </select>

       {currentUser && (
  <div className="add-game-panel">
    <h3 id="new">Добавить новую игру</h3>
    <input
      type="text"
      placeholder="Название"
      value={newGame.title}
      onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
      required
    />
    <select
      value={newGame.genre}
      onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
      required
    >
      <option value="">Выберите жанр</option>
      <option value="RPG">RPG</option>
      <option value="Souls-like">Souls-like</option>
      <option value="Открытый мир">Открытый мир</option>
      <option value="Приключения">Приключения</option>
      <option value="Экшен">Экшен</option>
      <option value="Шутер">Шутер</option>
      <option value="Хоррор">Хоррор</option>
      <option value="Песочница">Песочница</option>
    </select>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setNewGame((prev) => ({ ...prev, img: reader.result }));
          };
          reader.readAsDataURL(file);
        }
      }}
      required
    />
    <button
      onClick={() => {
        if (!newGame.title || !newGame.genre || !newGame.img) {
          alert("Пожалуйста, заполните все поля!");
          return;
        }
        handleAddGame();
      }}
    >
      Добавить игру
    </button>
  </div>
)}
        <div className="game-grid">
          {displayedGames.map((game, index) => (
            <div key={index} className="game-card">
              <img src={game.img} alt={game.title} />
              <h3>{game.title}</h3>
              <p>{game.genre}</p>
              <p>{game.description}</p>
              <div className="rating">{renderStars(index)}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          {visibleCount < sortedAndFilteredGames.length && (
            <button onClick={handleShowMore} className="show-more-button">
              Показать ещё
            </button>
          )}
          {visibleCount > 4 && (
            <button
              onClick={handleHide}
              className="hide-button"
              style={{ marginLeft: "10px" }}
            >
              Скрыть
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Catalog;
