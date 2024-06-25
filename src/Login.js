import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginSignup.module.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Login({ setConnected }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [osname, setOsname] = useState("ubuntu");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(username, password, osname, error);
    try {
      const response = await axios.post(
        "http://127.0.0.1:3004/teacher-login",
        {
          username,
          password,
          osname,
        }
      );

      console.log(response.data.user);

      //  if (!response.data || typeof response.data.user.accessToken !== "string") {
      //  throw new Error("Invalid or missing access token in the response.");
      //}

      const decodedToken = jwtDecode(response.data.user.accessToken);

      const userInfo = {
        id: decodedToken.id,
        userType: decodedToken.userType,
        username: decodedToken.username,
        firstname: decodedToken.firstname,
        lastname: decodedToken.lastname,
        email: decodedToken.email,
        avatar: decodedToken.avatar,
      };

      localStorage.setItem("token", response.data.user.accessToken);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      setConnected(true);

      navigate("/home", { replace: true });
    } catch (error) {
      console.error("Error logging in:", error.message);
      setError(error.message);
    }
  };

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className={styles.container}>
      <div className={styles.text}> تسجيل الدخول</div>
      <form action="#">
        <div className={styles.data}>
          <label>البريد الإلكتروني </label>

          <input
            type="text"
            placeholder="chouaib@9arini.dz"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.data}>
          <label>كلمة المرور</label>
          <input
            type="password"
            placeholder="●●●●●●●●●"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.forgotPass}>
          <a href="#">نسيت كلمة المرور؟</a>
        </div>
        <div className={styles.btn}>
          <div className={styles.inner}></div>
          <button onClick={handleLogin}>تسجيل الدخول</button>
        </div>
        {error && (
          <p style={{ color: "#ED5565", fontSize: "13px" }}>
            البريد الإلكتروني أو كلمة المرور خاطئة
          </p>
        )}
        <div className={styles.signupLink}>
          <a href="#">انضم الآن</a> وقدم سيرتك الذاتية
        </div>
      </form>
    </div>
  );
}
export default Login;
