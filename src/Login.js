import React, { useState } from "react";
import { Router, useNavigate, useHistory } from "react-router-dom";
import styles from "./LoginSignup.module.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function Login() {
  // localStorage.setItem(
  //   "token",
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDkwNDM1ODMsImlkIjoiZTZlOWZhMTEtYmMzMy00ZmFjLWIyMzEtYTRhMDJjM2YyNTlkIiwidXNlclR5cGUiOiJ0ZWFjaGVyIiwiYWNjb3VudElEIjoiZTZlOWZhMTEtYmMzMy00ZmFjLWIyMzEtYTRhMDJjM2YyNTlkIiwidXNlcm5hbWUiOiJUX2JpbGVsX2FiYmFzIiwiZmlyc3RuYW1lIjoiYmlsZWwiLCJsYXN0bmFtZSI6ImFiYmFzIiwiZW1haWwiOiJiaWxhbC5hYmJhc0B1bml2LWNvbnN0YW50aW5lMi5keiIsImF2YXRhciI6IlxuICAgIFx1MDAzY3N2ZyAgXG4gICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiXG4gICAgICB3aWR0aD1cIjY0cHhcIlxuICAgICAgaGVpZ2h0PVwiNjRweFwiXG4gICAgICB4PVwiMHB4XCJcbiAgICAgICAgeT1cIjBweFwiXG4gICAgICB2aWV3Qm94PVwiMCAwIDY0IDY0XCJcbiAgICAgIHZlcnNpb249XCIxLjFcIlxuICAgIFx1MDAzZVxuICAgICAgXHUwMDNjZGVmc1x1MDAzZVxuICAgICAgICBcdTAwM2NzdHlsZSB0eXBlPVwidGV4dC9jc3NcIlx1MDAzZVxuICAgICAgICAgIEBpbXBvcnQgdXJsKFwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1JbnRlcjp3Z2h0QDcwMFwiKTtcbiAgICAgICAgXHUwMDNjL3N0eWxlXHUwMDNlXG4gICAgICBcdTAwM2MvZGVmc1x1MDAzZVxuICAgICAgXHUwMDNjcmVjdCBmaWxsPVwiIzYyOTFhY1wiIGN4PVwiMzJcIiB3aWR0aD1cIjY0XCIgaGVpZ2h0PVwiNjRcIiBjeT1cIjMyXCIgcj1cIjMyXCIgL1x1MDAzZVxuICAgICAgXHUwMDNjdGV4dFxuICAgICAgICB4PVwiNTAlXCJcbiAgICAgICAgeT1cIjUwJVwiXG4gICAgICAgIHN0eWxlPVwiICAgICAgICAgIFxuICAgICAgICAgIGxpbmUtaGVpZ2h0OiAxO1xuICAgICAgICAgIGZvbnQtZmFtaWx5OiAnSW50ZXInLCBzYW5zLXNlcmlmO1xuICAgICAgICAgIGZvbnQtd2VpZ2h0OiA3MDA7XG4gICAgICAgIFwiXG4gICAgICAgIGFsaWdubWVudC1iYXNlbGluZT1cIm1pZGRsZVwiXG4gICAgICAgIHRleHQtYW5jaG9yPVwibWlkZGxlXCJcbiAgICAgICAgZm9udC1zaXplPVwiMjhcIlxuICAgICAgICBmb250LXdlaWdodD1cIjQwMFwiXG4gICAgICAgIGR5PVwiLjFlbVwiXG4gICAgICAgIGRvbWluYW50LWJhc2VsaW5lPVwibWlkZGxlXCJcbiAgICAgICAgZmlsbD1cIiMwMDAwMDBcIlxuICAgICAgXHUwMDNlYmFcbiAgICAgIFx1MDAzYy90ZXh0XHUwMDNlXG4gIFx1MDAzYy9zdmdcdTAwM2VcdFxuICAiLCJjcmVhdGUiOnsidXNlciI6ZmFsc2UsImxlYXJuaW5nIjp0cnVlLCJvcmdzIjpmYWxzZSwicGF5bWVudCI6ZmFsc2V9LCJ1cGRhdGUiOnsidXNlciI6ZmFsc2UsImxlYXJuaW5nIjp0cnVlLCJvcmdzIjpmYWxzZSwicGF5bWVudCI6ZmFsc2V9LCJyZWFkIjp7InVzZXIiOmZhbHNlLCJsZWFybmluZyI6dHJ1ZSwib3JncyI6ZmFsc2UsInBheW1lbnQiOmZhbHNlfSwiZGVsZXRlIjp7InVzZXIiOmZhbHNlLCJsZWFybmluZyI6dHJ1ZSwib3JncyI6ZmFsc2UsInBheW1lbnQiOmZhbHNlfX0.z3wTGgDnefcEOKLqPdnG5IvfEAz2Iy1DY7KEViZ0aPs"
  // );

  const [username, setUsername] = useState("a@a.com");
  const [password, setPassword] = useState("0");
  const [osname, setOsname] = useState("ubuntu");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
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
      if (
        !response.data ||
        typeof response.data.user.accessToken !== "string"
      ) {
        throw new Error("Invalid or missing access token in the response.");
      }
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
      navigate("/home");
      navigate("/home");
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
            // required
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
