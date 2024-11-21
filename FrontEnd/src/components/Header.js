import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen, faUser } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";

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
            <Container className="d-flex justify-content-between align-items-center text-white">
                {/* Logo  */}
                <Navbar.Brand href="/" className="d-flex align-items-center">
                    <h2 className="me-4 mb-0">
                        PROJECTS <FontAwesomeIcon icon={faFolderOpen} style={{ color: "white" }} />
                    </h2>
                </Navbar.Brand>

                {/* Navigation Menu */}
                <Nav className="mb-0">
                    <Nav.Item>
                        <Nav.Link href="/dashboard" className="text-white">Dashboards</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/projects" className="text-white">Projects</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/issues" className="text-white">Issues</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/help" className="text-white">Help</Nav.Link>
                    </Nav.Item>
                </Nav>

                {/* User Actions */}
                <div className="d-flex align-items-center ms-auto">
                    <FontAwesomeIcon icon={faUser} className="me-2" style={{ color: "white" }} />
                    <span className="me-3">Welcome, {userName}</span>
                    <Button variant="outline-secondary" className="rounded-pill" onClick={onLogout}>
                        Logout
                    </Button>
                </div>
            </Container>
        </Navbar>
    );
};

export default Header;
