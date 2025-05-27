import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SliderSection({ sliderGames }) {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 900,
    slidesToShow: 2,
    slidesToScroll: 1,
  };

  return (
    <div className="slidetop">
      <h2 id="popular">Лучшие релизы десятилетия</h2>
      <Slider {...sliderSettings}>
        {sliderGames.map((game, index) => (
          <div key={index} className="game-slide">
            <img src={game.img} alt={game.title} />
            <div className="game-info">
              <h3>{game.title}</h3>
              <p>{game.genre}</p>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default SliderSection;
