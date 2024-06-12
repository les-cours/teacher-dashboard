import React, { useState, useEffect } from 'react';
import './Switch.css';

const Switch = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <div className="switch-container">
      <input 
        className="switch-checkbox" 
        id={`dark-mode-switch`} 
        type="checkbox" 
        checked={isDarkMode} 
        onChange={toggleDarkMode} 
      />
      <label className="switch-label" htmlFor={`dark-mode-switch`}>
        <span className={`switch-button`} />
      </label>
    </div>
  );
};

export default Switch;
