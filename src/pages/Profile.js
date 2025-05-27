import React, { useState, useEffect } from "react";
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Profile.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, storage } from "../firebase-config";

function Profile({ setIsAuthenticated }) {
  const navigate = useNavigate();
  
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form fields
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  // Default avatar URL - using a placeholder service instead of local file
  const DEFAULT_AVATAR_URL = "https://ui-avatars.com/api/?name=User&background=4A90E2&color=fff&size=150";
  
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setDisplayName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
      setAvatarPreview(currentUser.photoURL || DEFAULT_AVATAR_URL);
    }
  }, [auth]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.className = theme;
  }, [theme]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const previewURL = URL.createObjectURL(file);
      setAvatarPreview(previewURL);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    
    try {
      // Создаем уникальное имя файла с временным штампом
      const timestamp = new Date().getTime();
      // Упрощаем имя файла, чтобы избежать проблем
      const fileName = `avatar_${timestamp}.jpg`;
      
      // Создаем путь для хранения аватара
      const avatarRef = ref(storage, `avatars/${user.uid}/${fileName}`);
      
      // Метаданные для файла
      const metadata = {
        contentType: avatarFile.type || 'image/jpeg',
        customMetadata: {
          'userId': user.uid,
          'uploadTime': timestamp.toString()
        }
      };
      
      // Загружаем файл
      console.log('Uploading avatar to:', `avatars/${user.uid}/${fileName}`);
      const uploadTask = await uploadBytes(avatarRef, avatarFile, metadata);
      console.log('Upload successful:', uploadTask);
      
      // Получаем URL загруженного файла
      const downloadURL = await getDownloadURL(avatarRef);
      console.log('Download URL:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      setError(`Ошибка при загрузке аватара: ${error.message}`);
      return null;
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Обновляем только то, что изменилось, чтобы ускорить процесс
      const updates = {};
      
      // Проверяем, изменилось ли имя пользователя
      if (displayName !== user.displayName) {
        updates.displayName = displayName;
      }
      
      // Загружаем аватар только если он был изменен
      if (avatarFile) {
        try {
          // Показываем индикатор загрузки аватара
          toast.info("Загрузка аватара...", { autoClose: false, toastId: "avatar-upload" });
          
          const uploadedPhotoURL = await uploadAvatar();
          console.log('Uploaded photo URL:', uploadedPhotoURL);
          
          if (uploadedPhotoURL) {
            updates.photoURL = uploadedPhotoURL;
            // Закрываем индикатор загрузки аватара
            toast.dismiss("avatar-upload");
            toast.success("Аватар успешно загружен");
          } else {
            toast.dismiss("avatar-upload");
            toast.error("Не удалось загрузить аватар");
          }
        } catch (avatarError) {
          console.error('Avatar upload error:', avatarError);
          toast.dismiss("avatar-upload");
          toast.error(`Ошибка загрузки аватара: ${avatarError.message}`);
        }
      }
      
      // Обновляем профиль только если есть изменения
      if (Object.keys(updates).length > 0) {
        await updateProfile(user, updates);
      }

      // Обновляем email только если он изменился
      if (email !== user.email) {
        // Проверяем наличие пароля для изменения email
        if (!currentPassword) {
          setError("Для изменения email требуется ввести текущий пароль");
          setIsLoading(false);
          return;
        }
        
        try {
          // Показываем индикатор изменения email
          toast.info("Обновление email...", { autoClose: false, toastId: "email-update" });
          
          const credential = EmailAuthProvider.credential(user.email, currentPassword);
          await reauthenticateWithCredential(user, credential);
          await updateEmail(user, email);
          
          // Закрываем индикатор изменения email
          toast.dismiss("email-update");
        } catch (emailError) {
          setError(`Ошибка обновления email: ${emailError.message}`);
          setIsLoading(false);
          return;
        }
      }

      // Обновляем данные пользователя в состоянии
      setUser({ ...auth.currentUser });
      setIsEditing(false);
      setCurrentPassword("");
      setAvatarFile(null);
      setSuccess("Профиль успешно обновлен!");
      toast.success("Профиль успешно обновлен!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(`Ошибка обновления профиля: ${error.message}`);
      toast.error(`Ошибка обновления профиля: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Новые пароли не совпадают");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Новый пароль должен содержать не менее 6 символов");
      setIsLoading(false);
      return;
    }

    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      setIsChangingPassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Пароль успешно изменен!");
      toast.success("Пароль успешно изменен!");
    } catch (error) {
      console.error("Error changing password:", error);
      setError(`Ошибка изменения пароля: ${error.message}`);
      toast.error(`Ошибка изменения пароля: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess("");
    
    // Reset form values to current user data
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setAvatarPreview(user.photoURL || DEFAULT_AVATAR_URL);
      setAvatarFile(null);
    }
  };

  if (!user) {
    return (
      <>
        <Header theme={theme} setTheme={setTheme} setIsAuthenticated={setIsAuthenticated} />
        <div className="profile-container">
          <h2>Загрузка профиля...</h2>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header theme={theme} setTheme={setTheme} setIsAuthenticated={setIsAuthenticated} />
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="profile-container">
        <h2 className="profile-title">Профиль пользователя</h2>
        
        <div className="profile-card">
          {!isEditing && !isChangingPassword ? (
            <>
              <div className="profile-avatar-container">
                <img 
                  src={user.photoURL || DEFAULT_AVATAR_URL} 
                  alt="Аватар пользователя" 
                  className="profile-avatar" 
                />
              </div>
              
              <div className="profile-info">
                <div className="profile-info-item">
                  <span className="profile-label">Имя:</span>
                  <span className="profile-value">{user.displayName || "Не указано"}</span>
                </div>
                
                <div className="profile-info-item">
                  <span className="profile-label">Email:</span>
                  <span className="profile-value">{user.email}</span>
                </div>
                
                <div className="profile-actions">
                  <button 
                    className="profile-button edit-button" 
                    onClick={() => setIsEditing(true)}
                  >
                    Редактировать профиль
                  </button>
                  
                  <button 
                    className="profile-button password-button" 
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Изменить пароль
                  </button>
                  
                  <button 
                    className="profile-button back-button" 
                    onClick={() => navigate("/")}
                  >
                    Вернуться на главную
                  </button>
                </div>
              </div>
            </>
          ) : isEditing ? (
            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className="profile-avatar-edit">
                <img 
                  src={avatarPreview || DEFAULT_AVATAR_URL} 
                  alt="Предпросмотр аватара" 
                  className="profile-avatar" 
                />
                
                <label className="avatar-upload-label">
                  Изменить аватар
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="avatar-upload-input" 
                  />
                </label>
              </div>
              
              <div className="form-group">
                <label htmlFor="displayName">Имя:</label>
                <input 
                  type="text" 
                  id="displayName" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  className="profile-input" 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input 
                  type="email" 
                  id="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="profile-input" 
                />
              </div>
              
              {email !== user.email && (
                <div className="form-group">
                  <label htmlFor="currentPassword">Текущий пароль (необходим для изменения email):</label>
                  <input 
                    type="password" 
                    id="currentPassword" 
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    className="profile-input" 
                  />
                </div>
              )}
              
              <div className="profile-form-actions">
                <button 
                  type="submit" 
                  className="profile-button save-button" 
                  disabled={isLoading}
                >
                  {isLoading ? "Сохранение..." : "Сохранить изменения"}
                </button>
                
                <button 
                  type="button" 
                  className="profile-button cancel-button" 
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="profile-form">
              <div className="form-group">
                <label htmlFor="currentPasswordChange">Текущий пароль:</label>
                <input 
                  type="password" 
                  id="currentPasswordChange" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)} 
                  className="profile-input" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">Новый пароль:</label>
                <input 
                  type="password" 
                  id="newPassword" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  className="profile-input" 
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Подтвердите новый пароль:</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  className="profile-input" 
                  required 
                />
              </div>
              
              <div className="profile-form-actions">
                <button 
                  type="submit" 
                  className="profile-button save-button" 
                  disabled={isLoading}
                >
                  {isLoading ? "Сохранение..." : "Изменить пароль"}
                </button>
                
                <button 
                  type="button" 
                  className="profile-button cancel-button" 
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Отмена
                </button>
              </div>
            </form>
          )}
          
          {error && <div className="profile-error">{error}</div>}
          {success && <div className="profile-success">{success}</div>}
        </div>
      </div>
      
      <Footer />
    </>
  );
}

export default Profile;
