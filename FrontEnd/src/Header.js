// src/Header.js
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ onLogout }) => { // Accept onLogout as a prop
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Load userName from localStorage
        const storedUserName = localStorage.getItem('userName');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []); // Empty dependency array means this runs once when the component mounts

    return (
        <header id="header" role="banner">
            <div className="aui-header-inner">
                <nav className="aui-header" aria-label="Site">
                    <h2>
                        PROJECTS <FontAwesomeIcon icon={faFolderOpen} style={{ color: 'white' }} />
                    </h2>
                    <ul className="aui-nav">
                        <li><a href="/dashboard">Dashboards</a></li>
                        <li><a href="/projects">Projects</a></li>
                        <li><a href="/issues">Issues</a></li>
                        <li><a href="/help">Help</a></li>
                    </ul>
                </nav>
                <div className="user-actions">
                    <div className="logged-in">
                        <span>Welcome, {userName}</span>
                        <button onClick={onLogout} className="logout-button">Logout</button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
