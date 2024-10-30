import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import './Project.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCode, faTrash, faFileCirclePlus, faCheck, faXmark, faPen, faQuestionCircle, faPause, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import ProjectDetails from "./ProjectDetails";
import Header from './Header'; 
import AddProjectModal from "./AddProjectModal"; 
import { PublicClientApplication } from "@azure/msal-browser"; // Import MSAL
import { authConfig, BASE_URL } from "./authConfig"; // Import the named exports

const msalInstance = new PublicClientApplication(authConfig); // Create a new MSAL instance

function App() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [accessToken, setAccessToken] = useState(null); // State for access token
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [userName, setUserName] = useState(""); // State to hold user's name
  const navigate = useNavigate(); // Hook to programmatically navigate
  
  // State for selected statuses
  const [selectedStatuses, setSelectedStatuses] = useState(["new", "active"]);
  const [projectDetailsModalOpen, setProjectDetailsModalOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  
  // Initialize MSAL on component mount
  useEffect(() => {
    const initializeMSAL = async () => {
      try {
        await msalInstance.initialize(); // Initialize MSAL
        console.log("MSAL Initialized");

        // Check for existing login state
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedUserName = localStorage.getItem('userName');
        
        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
          setUserName(storedUserName);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("MSAL Initialization error:", error);
      }
    };

    initializeMSAL(); // Call the initialize function
  }, []);


  // Fetching projects from the backend API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/projects`, {
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

  // Function to authenticate user
  const authenticateOneDrive = async () => {
    try {
      const response = await msalInstance.loginPopup({
        scopes: ["Files.ReadWrite", "User.Read"], // Define the scopes you need
      });
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ["Files.ReadWrite", "User.Read"],
        account: response.account,
      });
      setAccessToken(tokenResponse.accessToken);
      setIsLoggedIn(true);

      // Store the access token and user name in localStorage
      localStorage.setItem('accessToken', tokenResponse.accessToken);
      localStorage.setItem('userName', response.account.name);

      // Fetch user profile information
      const userProfileResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (userProfileResponse.ok) {
        const userProfileData = await userProfileResponse.json();
        setUserName(userProfileData.displayName);
      } else {
        console.error("Failed to fetch user profile");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

    // Function to log out the user
    const logout = () => {
      setAccessToken(null);
      setIsLoggedIn(false);
      setUserName("");
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userName');
      // Optionally, you can also sign out from MSAL. Currently creates issues when logging out, it would be maybe wise to confront the documentation on MSAL.
      // msalInstance.logout(); 
    };
  
  // Function to refresh the project list
  const refreshProjects = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
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
        const response = await fetch(`${BASE_URL}/api/projects/${id}`, {
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
    setIsModalOpen(false);
    setProjectDetailsModalOpen(false); 
    await refreshProjects();
  };

  // Adding a project
  const addProject = async (projectData) => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        await refreshProjects();

        // If the new project's status is "END" and it's not in the selectedStatuses, add it
        if (projectData.type.toLowerCase() === "end" && !selectedStatuses.includes("end")) {
          setSelectedStatuses([...selectedStatuses, "end"]);
        }
      } else {
        throw new Error('Failed to add project');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Function to handle adding a project from the modal
  const handleAddProject = async (projectData) => {
    await addProject(projectData);
    closeModal();
  };

  // Filtered projects based on search term, selected category, and selected status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name && project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatuses.includes(project.type.toLowerCase());

    return matchesSearch && matchesStatus;
  });

  // Function to toggle status selection
  const toggleStatus = (status) => {
    setSelectedStatuses(prevStatuses => {
      let updatedStatuses;
      if (prevStatuses.includes(status)) {
        updatedStatuses = prevStatuses.filter(s => s !== status);
      } else {
        updatedStatuses = [...prevStatuses, status];
      }
      return updatedStatuses;
    });
  };

  // Function to generate the header text based on selected category and status
  const getHeaderText = () => {
    let headerText = "All projects";

    if (selectedStatuses.length > 0) {
      headerText += ` - ${selectedStatuses.map(status => status.charAt(0).toUpperCase() + status.slice(1)).join(", ")}`;
    }

    return headerText;
  };

  return (
    <div className="App" style={{ textAlign: "left" }}>
      <Header onLogin={authenticateOneDrive} onLogout={logout} userName={isLoggedIn ? userName : null} />
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
              <li
                className={`filterIl ${selectedStatuses.includes("active") ? "selected" : ""}`}
                onClick={() => toggleStatus("active")}
              >
                <label>
                  <FontAwesomeIcon icon={faCheck} /> Active
                </label>
              </li>
              <li
                className={`filterIl ${selectedStatuses.includes("new") ? "selected" : ""}`}
                onClick={() => toggleStatus("new")}
              >
                <label>
                  <FontAwesomeIcon icon={faPen} /> New
                </label>
              </li>
              <li
                className={`filterIl ${selectedStatuses.includes("hold") ? "selected" : ""}`}
                onClick={() => toggleStatus("hold")}
              >
                <label>
                  <FontAwesomeIcon icon={faPause} /> Hold
                </label>
              </li>
              <li
                className={`filterIl ${selectedStatuses.includes("end") ? "selected" : ""}`}
                onClick={() => toggleStatus("end")}
              >
                <label>
                  <FontAwesomeIcon icon={faXmark} /> End
                </label>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content  
        The positioning style on main content will need revisit if want to work on mobile, this in only temporary */}
        <main style={{ maxHeight: "calc(100vh - 135px)", overflowY: "hidden" }}>
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
          <div style={{ maxHeight: "80%", overflowY: "auto" }}>
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
              onAddProject={handleAddProject}
            />
          </div>
        </main>
      </div>

      {projectDetailsModalOpen && (
        <ProjectDetails 
          projectId={currentProjectId} 
          onClose={closeModal} 
          accessToken={accessToken}
        />
      )}
    </div>
  );
}

export default App;
