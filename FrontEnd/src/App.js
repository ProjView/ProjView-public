import React, { useCallback, useState, useEffect, useRef } from "react";
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faFileCirclePlus, faCheck, faXmark, faPen, faPause } from '@fortawesome/free-solid-svg-icons';
import ProjectDetails from "./ProjectDetails";
import Header from './Header';
import AddProjectModal from "./AddProjectModal";
import { PublicClientApplication } from "@azure/msal-browser"; // Import MSAL
import { authConfig, BASE_URL } from "./authConfig"; // Import the named exports

const msalInstance = new PublicClientApplication(authConfig); // Create a new MSAL instance

const statusOrder = ["new", "active", "hold", "end"]; // Define the status order

function App() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const [newProjectId, setNewProjectId] = useState(null); // State to track the newly created project
  const projectListRef = useRef(null); // Ref for scrolling to the project list
  const [highlightActive, setHighlightActive] = useState(false); // State to track highlight status

  // State for selected category and status
  const [selectedStatuses, setSelectedStatuses] = useState(["new", "active"]); // Default selected statuses
  const [projectDetailsModalOpen, setProjectDetailsModalOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);

  // Function to refresh the access token
  const refreshAccessToken = useCallback(async () => {
    try {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        const tokenResponse = await msalInstance.acquireTokenSilent({
          scopes: ["Files.ReadWrite", "User.Read"],
          account: accounts[0],
        });
        setAccessToken(tokenResponse.accessToken);
        localStorage.setItem('accessToken', tokenResponse.accessToken);
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      // If refreshing the token fails, log the user out
      logout();
    }
  }, []);

  // Function to authenticate user
  const authenticateOneDrive = useCallback(async () => {
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
      await fetchUserProfile(tokenResponse.accessToken);
    } catch (error) {
      console.error("Authentication error:", error);
    }
  }, []);

  // Initialize MSAL on component mount
  useEffect(() => {
    const initializeMSAL = async () => {
      try {
        await msalInstance.initialize(); // Initialize MSAL
        console.log("MSAL Initialized");

        // Check for existing login state
        const storedAccessToken = localStorage.getItem('accessToken');

        if (storedAccessToken) {
          setAccessToken(storedAccessToken);
          setIsLoggedIn(true);
          await refreshAccessToken(); // Refresh token if it's close to expiring
        } else {
          // If not logged in, prompt for login
          await authenticateOneDrive();
        }
      } catch (error) {
        console.error("MSAL Initialization error:", error);
      }
    };

    initializeMSAL(); // Call the initialize function
  }, [authenticateOneDrive, refreshAccessToken]);

  // Function to sort projects
  const sortProjects = (projects) => {
    return projects.sort((a, b) => {
      const statusA = statusOrder.indexOf(a.type.toLowerCase());
      const statusB = statusOrder.indexOf(b.type.toLowerCase());
      if (statusA !== statusB) return statusA - statusB; // Sort by status
      return a.name.localeCompare(b.name); // Sort by name
    });
  };

  // Function to fetch user profile information
  const fetchUserProfile = async (token) => {
    try {
      const userProfileResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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
      console.error("Error fetching user profile:", error);
    }
  };

  // Function to log out the user
  const logout = () => {
    setAccessToken(null);
    setIsLoggedIn(false);
    setUserName("");
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
  };

  // Fetching projects from the backend API
  useEffect(() => {
    const fetchProjects = async () => {
      if (!isLoggedIn) return; // Don't fetch projects if not logged in

      try {
        const response = await fetch(`${BASE_URL}/api/projects`, {
          method: 'GET',
          headers: {
            'accept': '*/*',
            Authorization: `Bearer ${accessToken}` // Include the access token in the request
          }
        });

        if (response.ok) {
          const projectList = await response.json();
          setProjects(sortProjects(projectList)); // Sort projects after fetching
        } else {
          throw new Error('Failed to fetch projects');
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchProjects();
  }, [isLoggedIn, accessToken]); // Fetch projects when logged in status or access token changes


  // Function to refresh the project list
  const refreshProjects = async () => {
    if (!isLoggedIn) return; // Don't refresh if not logged in

    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          Authorization: `Bearer ${accessToken}` // Include the access token in the request
        }
      });

      if (response.ok) {
        const projectList = await response.json();
        setProjects(sortProjects(projectList)); // Sort projects after fetching
      } else {
        throw new Error('Failed to fetch projects');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const openProjectDetailsModal = (id) => {
    setCurrentProjectId(id);
    setProjectDetailsModalOpen(true);
    setHighlightActive(false); // Clear highlight when opening project details
  };

  // Deleting a project by ID
  const deleteProject = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}` // Include the access token in the request
        }
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

  const closeModal = async (newProjectStatus, newProjectId) => {
    setIsModalOpen(false);
    setProjectDetailsModalOpen(false);
    await refreshProjects();
  
    // Set the new project ID for highlighting
    setNewProjectId(newProjectId);
    setHighlightActive(true); // Activate the highlight
  
    // Ensure the new status is visible if not already selected
    const statusLower = newProjectStatus.toLowerCase();
    if (!selectedStatuses.includes(statusLower)) {
      setSelectedStatuses(prevStatuses => [...prevStatuses, statusLower]);
    }
  };  

  useEffect(() => {
    if (newProjectId) {
      const projectElement = document.getElementById(`project-${newProjectId}`);
      if (projectElement) {
        projectElement.scrollIntoView({ behavior: "smooth", block: "center" }); // Scroll to the new project
      }
    }
  }, [newProjectId]);

  // Function to toggle status selection
  const toggleStatus = (status) => {
    setSelectedStatuses(prevStatuses => {
      if (prevStatuses.includes(status)) {
        return prevStatuses.filter(s => s !== status);
      } else {
        return [...prevStatuses, status];
      }
    });
  };

  // Filtered projects based on search term and selected statuses
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name && project.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatuses.includes(project.type.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  // Function to generate the header text based on selected statuses
  const getHeaderText = () => {
    return `Projects - ${selectedStatuses.map(status => status.charAt(0).toUpperCase() + status.slice(1)).join(", ")}`;
  };

  return (
    <div className="App" style={{ textAlign: "left" }}>
      {isLoggedIn ? (
        <>
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
                  <li className="filterIl">
                    <a
                      href=""
                      onClick={() => toggleStatus("active")}
                      className={selectedStatuses.includes("active") ? "active" : ""}
                    >
                      <FontAwesomeIcon icon={faCheck} /> Active
                    </a>
                  </li>
                  <li className="filterIl">
                    <a
                      href=""
                      onClick={() => toggleStatus("new")}
                      className={selectedStatuses.includes("new") ? "active" : ""}
                    >
                      <FontAwesomeIcon icon={faPen} /> New
                    </a>
                  </li>
                  <li className="filterIl">
                    <a
                      href=""
                      onClick={() => toggleStatus("hold")}
                      className={selectedStatuses.includes("hold") ? "active" : ""}
                    >
                      <FontAwesomeIcon icon={faPause} /> Hold
                    </a>
                  </li>
                  <li className="filterIl">
                    <a
                      href=""
                      onClick={() => toggleStatus("end")}
                      className={selectedStatuses.includes("end") ? "active" : ""}
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
                <h2>{getHeaderText()}</h2>
                <input
                  id="search-bar"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search projects..."
                />
              </div>
              <div style={{ maxHeight: "80%", overflowY: "auto" }} ref={projectListRef}>
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
                    <tr
                      key={project.id}
                      id={`project-${project.id}`}
                      style={{
                        backgroundColor: highlightActive && newProjectId === project.id ? 'lightblue' : 'transparent',
                        transition: 'background-color 1s ease', // Smooth transition for visibility
                      }}
                    >
                      <td>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openProjectDetailsModal(project.id);
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
                  onClose={(newProjectStatus, newProjectId) => closeModal(newProjectStatus, newProjectId)} // Pass the newProjectId
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
        </>
      ) : (
        // If not logged in, do not render anything (login prompt will be handled in useEffect)
        null
      )}
    </div>
  );
}

export default App;