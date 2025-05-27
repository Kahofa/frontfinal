import React from "react";
import f1 from "../images/videos/f1.mp4";


const VideoCart = () => {
  return (
    <div id="home" className="header-background-intro">
      <video autoPlay loop muted>
        <source src={f1} type="video/mp4" />
      </video>
      <div className="header-background-intro-text">
        <h1>Исследуй мир игр</h1>
        <p>Открывай новые вселенные, знакомься с друзьями и оценивай игры.</p>
        <div className="button">
          <a href="#catalog"><span>Исследовать</span></a>
        </div>
      </div>
    </div>
  );
};

export default VideoCart;
