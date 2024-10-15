import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Načítanie projektov z backendu
    useEffect(() => {
        fetch('http://localhost:8080/projects')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading projects...</div>;
    }

    if (error) {
        return <div>Error loading projects: {error.message}</div>;
    }

    return (
        <div className="App">
            <h1>Projects List</h1>
            <div className="projects-container">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project.id} className="project-card">
                            <h2>{project.name}</h2>
                            <p>{project.description}</p>
                        </div>
                    ))
                ) : (
                    <p>No projects found.</p>
                )}
            </div>
        </div>
    );
}

export default App;
