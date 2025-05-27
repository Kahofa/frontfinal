import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";

const UserProfile = () => {
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [avatarFile, setAvatarFile] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setDisplayName(user?.displayName || "");
    setPhotoURL(user?.photoURL || "");
    setNewDisplayName(user?.displayName || "");
  }, [user]);

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      // Для предварительного просмотра аватара в браузере
      setPhotoURL(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setMessage("");
    try {
      if (!user) throw new Error("Пользователь не авторизован");

      let updateData = {};

      if (newDisplayName !== displayName) {
        updateData.displayName = newDisplayName;
      }

      if (avatarFile) {
        // Пример без загрузки на Firebase Storage, просто симулируем
        // Обычно здесь загружаем файл на Storage и получаем URL
        // Затем updateProfile с photoURL = загруженный URL
        // Для примера — фото временно с локального file URL
        updateData.photoURL = photoURL;
      }

      if (Object.keys(updateData).length > 0) {
        await updateProfile(user, updateData);
        setDisplayName(updateData.displayName || displayName);
        setPhotoURL(updateData.photoURL || photoURL);
        setAvatarFile(null);
        setMessage("Профиль обновлён успешно!");
      } else {
        setMessage("Нет изменений для сохранения.");
      }
    } catch (error) {
      setMessage(`Ошибка: ${error.message}`);
    }
  };

  if (!user) {
    return <p>Пользователь не авторизован.</p>;
  }

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      <h2>Профиль пользователя</h2>
      <div style={{ marginBottom: 20 }}>
        <img
          src={photoURL || "https://via.placeholder.com/150"}
          alt="Аватар"
          style={{ width: 150, height: 150, borderRadius: "50%", objectFit: "cover" }}
        />
      </div>
      <input type="file" accept="image/*" onChange={handleAvatarChange} />
      <div style={{ marginTop: 20 }}>
        <label>
          Имя пользователя:
          <input
            type="text"
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </label>
      </div>
      <div style={{ marginTop: 20 }}>
        <label>
          Email:
          <input
            type="email"
            value={user.email}
            disabled
            style={{ width: "100%", padding: 8, marginTop: 4, backgroundColor: "#eee" }}
          />
        </label>
      </div>
      <button
        onClick={handleSave}
        style={{
          marginTop: 20,
          padding: "10px 15px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Сохранить изменения
      </button>
      {message && <p style={{ marginTop: 15 }}>{message}</p>}
    </div>
  );
};

export default UserProfile;
