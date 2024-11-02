import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ onLogout, onOneDriveLogin }) => {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [oneDriveUserName, setOneDriveUserName] = useState("");
    const [userName, setUserName] = useState("");

    const toggleProfileModal = () => {
        setIsProfileModalOpen(!isProfileModalOpen);
    };

    useEffect(() => {
        const storedOneDriveUserName = localStorage.getItem("oneDriveUserName");
        if (storedOneDriveUserName) {
            setOneDriveUserName(storedOneDriveUserName);
        }
        const storedUserName = localStorage.getItem("userName");
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []); // Run only once on component mount

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isProfileModalOpen && e.target.closest('.user-profile-modal') === null) {
                setIsProfileModalOpen(false);
            }
        };

        document.body.addEventListener('click', handleOutsideClick);

        return () => {
            document.body.removeEventListener('click', handleOutsideClick);
        };
    }, [isProfileModalOpen]);

    const UserProfileModal = ({ isOpen, onClose, onLogout }) => {
        if (!isOpen) {
            return null;
        }

        const handleLogout = () => {
            onLogout();
            onClose();
            window.location.reload();
        };

        return (
            <div className="user-profile-modal">
                <h3>User Profile</h3>
                {oneDriveUserName && <p>OneDrive Username: {oneDriveUserName}</p>}
                {!oneDriveUserName && <button onClick={onOneDriveLogin}>OneDrive Login</button>}
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    };

    return (
        <header id="header" role="banner">
            <div className="aui-header-inner">
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
                    <div className="logged-in">
                        <span onClick={toggleProfileModal} style={{ cursor: 'pointer' }}>Welcome, {userName}</span>
                    </div>
                </div>
            </div>
            {isProfileModalOpen && <UserProfileModal isOpen={isProfileModalOpen} onClose={toggleProfileModal} onLogout={onLogout} />}
        </header>
    );
};

export default Header;
