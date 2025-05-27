import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../images/photo/logo.png";

function Header({ theme, setTheme, setIsAuthenticated }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/auth", { replace: true });
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="иконка" />
      </div>
      <nav>
        <ul>
          <li><a href="#home">Главная</a></li>
          <li><a href="#catalog">Каталог</a></li>
          <li><a href="#popular">Популярное</a></li>
          <li><a href="#new">Новинки</a></li>
          <li><a href="#reviews">Отзывы</a></li>
          <li>
            <select
              value={theme}
              onChange={(e) => {
                setTheme(e.target.value);
                document.body.setAttribute("data-theme", e.target.value);
              }}
            >
              <option value="light">Светлая тема</option>
              <option value="dark">Тёмная тема</option>
            </select>
          </li>
          <li>
            <button onClick={goToProfile}>Профиль</button>
          </li>
          <li>
            <button onClick={handleLogout}>Выйти</button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
