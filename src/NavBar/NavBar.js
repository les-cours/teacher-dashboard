import React from 'react';
import './NavBar.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from './logo.png';

function NavBar({ setConnected }) {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        setConnected(false);
        navigate("/login");
    };

    return (
        <div className='navBar'>
            <div className="logoDiv">
                <img src={logo} alt="Logo" />
            </div>

            <div style={{ marginLeft: "40px" }}>
                <Link to="/home">الرئيسية</Link>
                <Link to="/aboutUs">حول التطبيق </Link>
                <Link to="/contactUs">تواصل معنا  </Link>
                <Link to="/dashboard">لوحة التحكم </Link>
                <Link to="/profil">الصفحة الشخصية </Link>
                <button onClick={logout}>Logout</button>
            </div>
        </div>
    );
}

export default NavBar;
