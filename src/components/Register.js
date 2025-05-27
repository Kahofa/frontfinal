import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,      // импорт для сброса пароля
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../Register.css";

const Auth = ({ setIsAuthenticated }) => {
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isResetMode, setIsResetMode] = useState(false); // режим сброса пароля
  const navigate = useNavigate();

  const toggleMode = () => {
    setMessage("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsResetMode(false);
    setIsRegister(!isRegister);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (isResetMode) {
      // Обработка сброса пароля
      if (!email) {
        setMessage("Введите email для сброса пароля");
        return;
      }
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage("Письмо для сброса пароля отправлено на вашу почту");
      } catch (error) {
        setMessage(`Ошибка: ${error.message}`);
      }
      return;
    }

    if (isRegister) {
      if (password.length < 6) {
        setMessage("Пароль должен быть не менее 6 символов");
        return;
      }
      if (password !== confirmPassword) {
        setMessage("Пароли не совпадают");
        return;
      }
    }

    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("Регистрация успешна!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("Вход выполнен успешно!");
        navigate("/");
      }
      localStorage.setItem("token", "true");
      setIsAuthenticated(true);
    } catch (error) {
      setMessage(`Ошибка: ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    setMessage("");
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      setMessage("Вход через Google успешен!");
      localStorage.setItem("token", "true");
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      setMessage(`Ошибка входа через Google: ${error.message}`);
    }
  };

  return (
    <div className="auth-container">
      <h2>
        {isResetMode
          ? "Сброс пароля"
          : isRegister
          ? "Регистрация"
          : "Вход"}
      </h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input"
          disabled={isResetMode && !email} // можно запретить ввод, если хочешь
        />

        {!isResetMode && (
          <>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!isResetMode}
              className="auth-input"
              disabled={isResetMode}
            />
            {isRegister && (
              <input
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required={!isResetMode}
                className="auth-input"
                disabled={isResetMode}
              />
            )}
          </>
        )}

        <button type="submit" className="auth-button">
          {isResetMode
            ? "Отправить письмо для сброса"
            : isRegister
            ? "Зарегистрироваться"
            : "Войти"}
        </button>
      </form>

      {!isResetMode && (
        <>
          <button
            onClick={handleGoogleLogin}
            className="auth-button google-button"
            style={{
              marginTop: "15px",
              backgroundColor: "#4285F4",
              color: "white",
              border: "none",
            }}
          >
            Войти через Google
          </button>

          <p className="auth-toggle-text">
            {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}{" "}
            <button onClick={toggleMode} className="auth-toggle-button">
              {isRegister ? "Войти" : "Зарегистрироваться"}
            </button>
          </p>
          <p style={{ marginTop: "10px" }}>
            <button
              onClick={() => {
                setMessage("");
                setIsResetMode(true);
              }}
              className="auth-toggle-button"
              style={{ fontSize: "14px" }}
            >
              Забыли пароль?
            </button>
          </p>
        </>
      )}

      {isResetMode && (
        <p style={{ marginTop: "10px" }}>
          <button
            onClick={() => {
              setMessage("");
              setIsResetMode(false);
            }}
            className="auth-toggle-button"
            style={{ fontSize: "14px" }}
          >
            Вернуться к {isRegister ? "регистрации" : "входу"}
          </button>
        </p>
      )}

      {message && <p className="auth-message">{message}</p>}
    </div>
  );
};

export default Auth;
