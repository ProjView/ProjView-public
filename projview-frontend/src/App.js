import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import './Project.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCode, faTrash, faFileCirclePlus, faCheck, faXmark, faPen, faQuestionCircle, faPause, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import ProjectDetails from "./ProjectDetails";
import Header from './Header'; 
import AddProjectModal from "./AddProjectModal"; 

function App() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate(); // Hook to programmatically navigate
  
  // State for selected category and status
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [projectDetailsModalOpen, setProjectDetailsModalOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  
  // Fetching projects from the backend API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/projects', {
          method: 'GET',
          headers: { 'accept': '*/*' }
        });
        
        if (response.ok) {
          const projectList = await response.json();
          setProjects(projectList);
        } else {
          throw new Error('Failed to fetch projects');
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchProjects();
  }, []);
  
  // Function to refresh the project list
  const refreshProjects = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/projects', {
        method: 'GET',
        headers: { 'accept': '*/*' }
      });
      
      if (response.ok) {
        const projectList = await response.json();
        setProjects(projectList);
      } else {
        throw new Error('Failed to fetch projects');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Function to open the project details modal
  const openProjectDetailsModal = (id) => {
    setCurrentProjectId(id);
    setProjectDetailsModalOpen(true);
  };

  // Deleting a project by ID
  const deleteProject = async (id) => {
    try {
        const response = await fetch(`http://localhost:8080/api/projects/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProjects(projects.filter(project => project.id !== id)); // Update projects state
        } else {
          throw new Error('Failed to delete project');
        }
      } catch (error) {
        console.error(error.message);
      }
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = async () => {
    await refreshProjects(); // Refresh the project list
    setIsModalOpen(false);
    setProjectDetailsModalOpen(false); 
  };

  // Adding a project
  const addProject = async (projectData) => {
    try {
      const response = await fetch('http://localhost:8080/api/projects', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        await refreshProjects();
      } else {
        throw new Error('Failed to add project');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Filtered projects based on search term, selected category, and selected status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name && project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || project.type.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Function to generate the header text based on selected category and status
  const getHeaderText = () => {
    let headerText = "All projects";

    if (selectedStatus !== "all") {
      headerText += ` - ${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}`;
    }

    return headerText;
  };

  return (
    <div className="App" style={{ textAlign: "left" }}>
      <Header /> {/* Assuming you have a Header component */}
      <div className="aui-page-header">
        <div className="aui-page-header-inner">
          <h1>Browse projects</h1>
        </div>
      </div>
      <div className="main-container">
        {/* Sidebar */}
        <aside>
          <div className="filter-section">
            <h4>Statuses</h4>
            <ul className="filterUl"> 
              <li className="filterIl">
                <a 
                  href="#" 
                  onClick={() => setSelectedStatus("all")} 
                  className={selectedStatus === "all" ? "active" : ""}
                >
                  All statuses
                </a>
              </li>
              <li className="filterIl">
                <a 
                  href="#" 
                  onClick={() => setSelectedStatus("active")} 
                  className={selectedStatus === "active" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faCheck} /> Active
                </a>
              </li>
              <li className="filterIl">
                <a 
                  href="#" 
                  onClick={() => setSelectedStatus("new")} 
                  className={selectedStatus === "new" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faPen} /> New
                </a>
              </li>
              <li className="filterIl">
                <a 
                  href="#" 
                  onClick={() => setSelectedStatus("hold")} 
                  className={selectedStatus === "hold" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faPause} /> Hold
                </a>
              </li>
              <li className="filterIl">
                <a 
                  href="#" 
                  onClick={() => setSelectedStatus("end")} 
                  className={selectedStatus === "end" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faXmark} /> End
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main>
          <div className="project-list-header">
            <h2>{getHeaderText()}</h2> {/* Updated header text based on selections */}
            <input
              id="search-bar"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
            />
          </div>
          <div style={{ maxHeight: "70%", overflowY: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Status</th>
                <th>Project lead</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <a 
                      href="#" 
                      onClick={(e) => {
                          e.preventDefault(); // Prevent default anchor behavior
                          openProjectDetailsModal(project.id); // Open the project details modal
                      }} 
                      style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {project.name}
                    </a>
                  </td>
                  <td>           
                    {project.type.toLowerCase() === "active" && <FontAwesomeIcon icon={faCheck} />}
                    {project.type.toLowerCase() === "new" && <FontAwesomeIcon icon={faPen} />}
                    {project.type.toLowerCase() === "hold" && <FontAwesomeIcon icon={faPause} />}
                    {project.type.toLowerCase() === "end" && <FontAwesomeIcon icon={faXmark} />}
                  </td>
                  <td>{project.lead}</td>
                  <td>{project.url || 'No URL'}</td>
                  <td style={{ width: "10px" }}>
                    <FontAwesomeIcon icon={faTrash} onClick={() => deleteProject(project.id)} style={{ cursor: 'pointer', color: 'red' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          <div style={{ marginTop: "20px" }}>
            <button onClick={openModal} className="add-project-btn">
              <FontAwesomeIcon icon={faFileCirclePlus} style={{ color: 'white' }} />
            </button>

            <AddProjectModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onAddProject={addProject}
            />
          </div>
        </main>
      </div>

      {projectDetailsModalOpen && (
        <ProjectDetails 
          projectId={currentProjectId} 
          onClose={closeModal} 
        />
      )}
    </div>
  );
}

export default App;