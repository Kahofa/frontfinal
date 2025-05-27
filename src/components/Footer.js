import React from "react";

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-section">
          <h1>Навигация</h1>
          <ul>
            <li><a href="#">Главная</a></li>
            <li><a href="#">Каталог</a></li>
            <li><a href="#">Популярное</a></li>
            <li><a href="#">Новинки</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h1>Свяжитесь с нами</h1>
          <ul>
            <li><a href="#">support@gamelibrary.com</a></li>
            <li><a href="#">Telegram</a></li>
            <li><a href="#">Discord</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h1>О нас</h1>
          <p>GameLibrary - это портал для поиска, оценки и обзора игр.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
