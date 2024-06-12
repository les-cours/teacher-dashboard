import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import styles from "./DropdownMenu.module.css";

function Dashboard() {
  const [isVisible, setisVisible] = useState(true);
  const toggleVisibility = () => {
    setisVisible(!isVisible);
  };
  const [teacherId, setteacherId] = useState(null);

  const navigate = useNavigate();
  useEffect(() => {
    navigate("/classrooms");
  }, []);
  // const teacherID = "d9e8d13c-8e0c-43aa-adec-54ce385bb07e"; // Replace with the actual teacher ID

  return (
    <div className={styles.dashboard}>
      <div className={styles.side}>
        <Link
          className={`${styles.sideLink} ${isVisible ? styles.active : ""}`}
          onClick={toggleVisibility}
          to="/classrooms"
        >
          الأقسام
          {isVisible ? (
            <svg
              className="animation"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
            >
              <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z" />
            </svg>
          ) : (
            <svg
              className="animation"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#5f6368"
            >
              <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </svg>
          )}
        </Link>

        <div>{isVisible && <DropdownMenu teacherID={teacherId} />}</div>
      </div>

      <div className={styles.outlet}>
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
