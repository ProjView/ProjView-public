import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import './Project.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCode, faTrash, faFileCirclePlus, faCheck, faXmark, faPen, faQuestionCircle, faPause, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import ProjectDetails from "./ProjectDetails";
import Header from './Header'; 
import AddProjectModal from "./AddProjectModal"; 
import Login from './Login';
import Register from './Register';
import { PublicClientApplication } from "@azure/msal-browser"; // Import MSAL
import { authConfig, BASE_URL } from "./authConfig"; // Import the named exports

const msalInstance = new PublicClientApplication(authConfig); // Create a new MSAL instance

function App() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [accessToken, setAccessToken] = useState(null); // State for access token
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [userName, setUserName] = useState(""); // State to hold user's name
  const [oneDriveUserName, setOneDriveUserName] = useState(""); // State to hold user's name
  const [token, setToken] = useState(""); // Login token
  const [userGroupNumber, setUserGroupNumber] = useState(0);
  const navigate = useNavigate(); // Hook to programmatically navigate
  
  // State for selected category and status
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [projectDetailsModalOpen, setProjectDetailsModalOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${token}` // Include the access token in the Authorization header
        }
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

  const handleLogin = (newToken, userName) => {
    setToken(newToken); // Set the token in the state
    setUserName(userName); // Set the userName in the state
  };

  // Trigger fetchProjects when the token state changes
  useEffect(() => {
    if (token) {
      fetchProjects();
    }
  }, [token]);
    
  // Initialize MSAL on component mount
  useEffect(() => {
    const initializeMSAL = async () => {
      try {
        await msalInstance.initialize(); // Initialize MSAL
        console.log("MSAL Initialized");

        // Check for existing login state
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedOUserName = localStorage.getItem('oneDriveUserName');

        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
          setOneDriveUserName(storedOUserName);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("MSAL Initialization error:", error);
      }
    };

    initializeMSAL(); // Call the initialize function
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
      localStorage.setItem('oneDriveUserName', response.account.name);

      // Fetch user profile information
      const userProfileResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokenResponse.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (userProfileResponse.ok) {
        window.location.reload();
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
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("oneDriveUserName");
      // Optionally, you can also sign out from MSAL. Currently creates issues when logging out, it would be maybe wise to confront the documentation on MSAL.
      // msalInstance.logout(); 
    };
  
  // Function to refresh the project list
  const refreshProjects = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: 'GET',
        headers: { 'accept': '*/*',
          'Authorization': `Bearer ${token}` // Include the access token in the Authorization header
        }       
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
          headers: {
            'Authorization': `Bearer ${token}` // Include the access token in the Authorization header
          },
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
       {token ? (
        <>
          <Header onLogout={logout} onOneDriveLogin={authenticateOneDrive}/>
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
                  token={token}
                />
              </div>
            </main>
          </div>

          {projectDetailsModalOpen && (
            <ProjectDetails 
              projectId={currentProjectId} 
              onClose={closeModal} 
              accessOToken={accessToken}
              token={token}
            />
          )}
        </>
        ) : (
            // Render the login page if the user is not logged in
            isLogin ? (
              <Login onLogin={handleLogin} setIsLogin={setIsLogin} />
            ) : (
              <Register setIsLogin={setIsLogin} />
            )
        )}
    </div>
  );
}

export default App;