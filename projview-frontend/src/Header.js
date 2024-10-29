// src/Header.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ onLogin, onLogout, userName }) => { // Accept onLogout as a prop
    return (
        <header id="header" role="banner">
            <div className="aui-header-inner">
                {/* <div className="aui-header-before">
                    <span id="logo" className="aui-header-logo">
                        <a href="/" aria-label="Go to home page">
                            <img src="/path/to/logo.png" alt="Logo" style={{ height: '40px' }} />
                        </a>
                    </span>
                </div> */}
                <nav className="aui-header" aria-label="Site">
                    <h2>
                        PROJECTS <FontAwesomeIcon icon={faFolderOpen} style={{ color: 'white' }} />
                    </h2>
                    <ul className="aui-nav">
                        <li>
                            <a href="/dashboard">Dashboards</a>
                        </li>
                        <li>
                            <a href="/projects">Projects</a>
                        </li>
                        <li>
                            <a href="/issues">Issues</a>
                        </li>
                        <li>
                            <a href="/help">Help</a>
                        </li>
                    </ul>
                </nav>
                <div className="user-actions">
                    {userName ? (
                        <div className="logged-in">
                            <span>Welcome, {userName}</span>
                            <button onClick={onLogout} className="logout-button">Logout</button>
                        </div>
                    ) : (
                        <button onClick={onLogin} className="login-button">Login to OneDrive</button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
