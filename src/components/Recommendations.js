import React, { useState, useEffect } from "react";

const ADMIN_UID = "7VzvPFT2oHW5e284LxfYJBkE1AC3";
const STORAGE_KEY = "recommendations";

function Recommendations({ currentUser, games = [] }) {
  const isAdmin = currentUser?.uid === ADMIN_UID;

  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setRecommendations(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recommendations));
  }, [recommendations]);

  const [selectedGame, setSelectedGame] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reaction, setReaction] = useState(null);

  function addRecommendation(rec) {
  setRecommendations(function (prev) {
    return [...prev, rec];
  });
}

  function deleteRecommendation(index) {
  setRecommendations(function (prev) {
    return prev.filter(function (_, i) {
      return i !== index;
    });
  });
}


  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedGame && reviewText && reaction) {
      addRecommendation({
        title: selectedGame,
        review: reviewText,
        reaction: reaction,
       userEmail: currentUser?.email || "Неизвестный",
      });
      setSelectedGame("");
      setReviewText("");
      setReaction(null);
    }
  };

  return (
    <div id="reviews"className="recommendations-container">
      <h2 className="recommendations-title">Рекомендации</h2>
      <form onSubmit={handleSubmit} className="recommendations-form">
        <div className="form-group">
          <label htmlFor="gameSelect" className="form-label">Выберите игру</label>
          <select
            id="gameSelect"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="form-select"
          >
            <option className="optionrec" value="">Выберите игру</option>
            {games.map((game, index) => (
              <option key={index} value={game.title}>
                {game.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reviewText" className="form-label">Оставьте отзыв</label>
          <textarea
            id="reviewText"
            placeholder="Оставьте отзыв"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="form-textarea"
          />
        </div>

        <div className="reaction-buttons">
          <button
            type="button"
            className={`reaction-btn ${reaction === "like" ? "selected" : ""}`}
            onClick={() => setReaction("like")}
          >
            👍
          </button>
          <button
            type="button"
            className={`reaction-btn ${reaction === "dislike" ? "selected" : ""}`}
            onClick={() => setReaction("dislike")}
          >
            👎
          </button>
        </div>

        <button type="submit" className="submit-btn">Добавить</button>
      </form>

      <div className="recommendations-list">
        {recommendations.map((rec, index) => (
          <div key={index} className="recommendation-item">
            <h3 className="recommendation-title">{rec.title}</h3>
            <p className="recommendation-review">Отзыв: {rec.review}</p>
            <p className="recommendation-reaction">
              {rec.reaction === "like" ? "👍" : "👎"}
            </p>
            <p className="recommendation-user">
  Пользователь: <strong>{rec.userEmail}</strong>
</p>

            {isAdmin && (
              <button 
                className="delete-btn"
                onClick={() => deleteRecommendation(index)}
              >
                Удалить
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Recommendations;
