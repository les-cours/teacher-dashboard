import React, { useEffect, useState, useRef } from "react";
import styles from "./NavBar.module.css";
import { Link, useNavigate } from "react-router-dom";
import logo from "./logo.png";
import Switch from "../Switch";

function NavBar({ setConnected }) {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileInfoVisible, setProfileInfoVisible] = useState(false);
  const profileRef = useRef(null);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode");
    setProfileInfoVisible(false);
  };

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    setProfileInfoVisible(false);
    if (userInfo) {
      const user = JSON.parse(userInfo);
      const avatarSVG = user.avatar;
      setAvatar(avatarSVG);
    }

    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileInfoVisible(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const showProfileHandler = () => {
    setProfileInfoVisible(!isProfileInfoVisible);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setConnected(false);
    navigate("/login");
  };

  return (
    <div className={styles.navBar}>
      <div className={styles.logoDiv}>
        <Link to="/" style={{ all: "unset", cursor: "pointer" }}>
          <img src={logo} alt="Logo" />
        </Link>
      </div>

      <div className={styles.linksDiv} style={{ marginLeft: "40px" }}>
        <Link to="/home" className={styles.link}>
          الرئيسية
        </Link>
        <Link to="/chatRoom" className={styles.link}>
          الدردشة
        </Link>
        <Link to="/contactUs" className={styles.link}>
          تواصل معنا{" "}
        </Link>
        <Link to="/Live" className={styles.link}>
          حصة مباشرة
        </Link>
        <Link to="/classrooms" className={styles.link}>
          دروسي
        </Link>

        <div className={styles.profile} ref={profileRef}>
          <div className={styles.avatarContainer} onClick={showProfileHandler}>
            {avatar && avatar.includes("<svg") ? (
              <div dangerouslySetInnerHTML={{ __html: avatar }} />
            ) : (
              <img src={avatar} alt="Avatar" />
            )}
          </div>
          {isProfileInfoVisible && (
            <div className={styles.profileInfo}>
              <button
                onClick={() => {
                  navigate("/profile");
                  setProfileInfoVisible(false);
                }}
              >
                تعديل الملف الشخصي
              </button>
              <button className={styles.dark}>
                الوضع المظلم
                <Switch
                  isDarkMode={isDarkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              </button>

              <button onClick={logout} className={styles.logoutButton}>
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavBar;
