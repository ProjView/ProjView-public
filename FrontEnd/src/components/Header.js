import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faUser } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import { Navbar, Container, Button } from "react-bootstrap";

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
        <Navbar bg="dark" variant="dark" className="py-2">
            <Container fluid>
                {/* Logo */}
                <Navbar.Brand href="/" className="d-flex align-items-center me-4">
                    <h2 className="mb-0 text-white">
                        PROJECTS <FontAwesomeIcon icon={faFolderOpen} style={{ color: "white" }} />
                    </h2>
                </Navbar.Brand>
                {/* Right Section: User Actions */}
                <div className="d-flex align-items-center ms-auto">
                    <FontAwesomeIcon icon={faUser} className="me-2" style={{ color: "white" }} />
                    <span className="me-3 text-white">Welcome, {userName}</span>
                    <Button variant="outline-secondary" className="rounded-pill" onClick={onLogout}>
                        Logout
                    </Button>
                </div>

            </Container>
        </Navbar>
    );
};

export default Header;
