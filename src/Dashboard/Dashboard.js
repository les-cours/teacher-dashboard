import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import jsonData from "./data.json";
import DropdownMenu from "./DropdownMenu";
import D from "./DropdownMenu";
import "./Dashboard.css";
import { jwtDecode } from "jwt-decode";
function Dashboard() {
  const [isVisible, setisVisible] = useState(false);
  const toggleVisibility = () => {
    setisVisible(!isVisible);
  };
  const [teacherId, setteacherId] = useState(null);
  useEffect(() => {

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
       console.log(decodedToken);
      const teacherId = decodedToken.id;
      setteacherId(teacherId)
    } 
  }, []);
  // const teacherID = "d9e8d13c-8e0c-43aa-adec-54ce385bb07e"; // Replace with the actual teacher ID


  return (
    <div className="dashboard">
      <div className="side">
        <div>
          <Link
            className="sideLink"
            onClick={toggleVisibility}
            to="/dashboard/classrooms"
          >
            الأقسام
          </Link>
        </div>
        <div>{isVisible && <DropdownMenu teacherID={teacherId} />}</div>
      </div>

     <div><Outlet/></div>
    </div>
  );
}

export default Dashboard;
