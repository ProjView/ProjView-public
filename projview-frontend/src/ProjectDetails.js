import React, { useEffect, useState } from "react";
import FileTree from "./FileTree"; // Import the FileTree component
import './ProjectDetails.css'; // Import the CSS for styling
import { BASE_URL } from "./authConfig"

const ProjectDetails = ({ projectId, onClose, accessOToken, token }) => {
    const [project, setProject] = useState(null); // State to hold project details
    const [username, setUsername] = useState(""); // State for username
    const [comment, setComment] = useState(""); // State for comment
    const [selectedStatus, setSelectedStatus] = useState(""); // State for selected status
    const [projectLead, setProjectLead] = useState(""); // State for project lead
    const [projectName, setProjectName] = useState(""); // State for project name
    const [description, setDescription] = useState(""); // State for project description
    const [folderData, setFolderData] = useState(null); // State to hold folder data
    const [oneDriveFolder, setOneDrivefolder] = useState(""); // State to hold oneDriveFolder name
    const [userRoles, setUserRoles] = useState([]); // State for user roles
    const [assignedRoles, setAssignedRoles] = useState([]); // State for roles assigned to the project

    // Define role constants
    const ROLES = {
        USER: 1,
        DEVELOPER: 2,
        DEVLEAD: 4,
        PROJECTMANAGER: 8,
        CONSULTANT: 16,
        ADMIN: 32
    };

    // Function to decode group number into role names
    const getRolesFromGroupNumber = (groupNumber) => {
        const roles = [];
        for (const [role, value] of Object.entries(ROLES)) {
            if (groupNumber & value) { // Check if the bit is set
                roles.push(role); // Add role name to the array
            }
        }
        return roles;
    };

    // Function to calculate group number from assigned roles
    const calculateGroupNumber = () => {
        return assignedRoles.reduce((acc, role) => {
            const value = ROLES[role]; // Get the bit value for the role
            return acc | value; // Use bitwise OR to accumulate the group number
        }, 0);
    };

    // Function to add a role to the project
    const addRole = (role) => {
        if (!assignedRoles.includes(role)) {
            setAssignedRoles([...assignedRoles, role]);
        }
    };

    // Function to remove a role from the project
    const removeRole = (role) => {
        if (userRoles.includes(role)) { // Only allow removal if the user has the role
            setAssignedRoles(assignedRoles.filter(r => r !== role));
        }
    };

    // Fetch user roles from /api/user/authorization
    const fetchUserRoles = async () => {
        try {
            const getUserName = localStorage.getItem("userName");
            const response = await fetch(`${BASE_URL}/api/user/authorities?username=${getUserName}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Include the access token
                }
            });
            if (response.ok) {
                const data = await response.json();
                setUserRoles(data.authorities); // Assuming authorities is an array of role names
            } else {
                console.error("Failed to fetch user roles");
            }
        } catch (error) {
            console.error("Error fetching user roles:", error);
        }
    };

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
                    method: 'GET',
                    headers: { 'accept': '*/*',
                                'Authorization': `Bearer ${token}` // Include the access token in the Authorization header
                    }
                });
                const projectData = await response.json();
                setProject(projectData);
                setProjectName(projectData.name || ""); // Set initial project name
                setProjectLead(projectData.lead || ""); // Set initial project lead
                setDescription(projectData.description || "");
                setSelectedStatus(projectData.type || "New"); 
                setOneDrivefolder(projectData.oneDriveFolder || ""); // Set initial oneDriveFolder
                // Decode the group number to set assigned roles
                setAssignedRoles(getRolesFromGroupNumber(projectData.group || 0)); // Assuming groupNumber is part of projectData

                // Check if projectName is defined before fetching OneDrive data
                if (projectData.oneDriveFolder) {
                    fetchOneDriveData(projectData.oneDriveFolder);  
                }
            } catch (error) {
            console.error("Error fetching project details:", error);
            }
        };
        fetchUserRoles(); // Fetch user roles when component mounts
        fetchProjectDetails();
    }, [projectId]);

    const fetchOneDriveData = async (oneDriveFolder) => {
        if (!accessOToken) return; // Ensure access token is available

        try {
            const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${oneDriveFolder}:/children`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessOToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const data = await response.json();
                setFolderData(data.value); // Set folder data
            } else {
                throw new Error("Failed to fetch OneDrive data");
            }
        } catch (error) {
            console.error("Error fetching OneDrive data:", error);
        }
    };

    const updateProject = async (updatedData) => {
        try {
            const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the access token in the Authorization header
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const updatedProject = await response.json();
                setProject(updatedProject);
            } else {
                console.error("Failed to update project");
            }
        } catch (error) {
            console.error("Error updating project:", error);
        }
        setOneDrivefolder(updatedData.oneDriveFolder);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (username.trim() && comment.trim()) {
            // Assuming the comments are part of the project data and you have an endpoint to update it.
            const updatedComments = [...(project.comments || []), { username, comment }];
            const updatedData = {
                ...project,
                comments: updatedComments
            };
            updateProject(updatedData);
            setComment("");
            setUsername("");
        }
    };

    const closeModal = async() => {
        const updatedData = {
            name: projectName,
            lead: projectLead,
            type: selectedStatus,
            description: description,
            oneDriveFolder: oneDriveFolder,
            group: calculateGroupNumber(), // Calculate group number from assigned roles
        };
        updateProject(updatedData);
        setTimeout(() => {
            onClose(); // Call onClose to refresh the project list and close the modal
            document.body.classList.remove("modal-open");
        }, 250); 
    };

    const checkFolderExists = async (oneDriveFolder) => {
        if (!accessOToken) return false; // Ensure access token is available

        try {
            const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${oneDriveFolder}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessOToken}`,
                    "Content-Type": "application/json",
                },
            });

            return response.ok; // If the response is ok, the folder exists
        } catch (error) {
            console.error("Error checking folder existence:", error);
            return false; // Assume folder does not exist on error
        }
    };

    const createFolder = async (newFolderName) => {
        if (!accessOToken) return; // Ensure access token is available

        try {
            const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${newFolderName}:/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessOToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newFolderName, folder: {} }),
            });
            if (response.ok) {
                // Refresh the folder data after creating the folder
                fetchOneDriveData([newFolderName]);
                await updateProject({ ...project, oneDriveFolder: newFolderName }); // Update the project with the new folder name
            } else {
                console.error("Failed to create the folder");
            }
        } catch (error) {
            console.error("Error creating the folder:", error);
        }
    };

    const updateFolder = async () => {
        const newFolderName = prompt("Enter the new OneDrive folder name:");
        if (newFolderName) {
            try {
                if (!accessOToken) {
                    throw new Error("Access token is missing. Please log in to access OneDrive.");
                }
    
                // Check if the folder already exists
                const exists = await checkFolderExists(newFolderName);
                setOneDrivefolder([newFolderName]); // Need to refresh fileTree after this
    
                if (exists) {
                    // If it exists, fetch the folder data and update the project
                    await fetchOneDriveData(newFolderName);
                    await updateProject({ ...project, oneDriveFolder: newFolderName });
                } else {
                    // If it doesn't exist, create the folder
                    await createFolder(newFolderName);
                }
            } catch (error) {
                console.error("Error updating OneDrive folder:", error);
                if (error.message === "Access token is missing. Please log in to access OneDrive.") {
                    alert("Access token is missing. Please log in to access OneDrive.");
                } else {
                    alert("An error occurred while updating the OneDrive folder. Please try again.");
                }
            }
        }
    };

    const changeFolder = async (newFolderName) => {
        if (newFolderName) {
            try {
                // Check if the folder already exists
                const exists = await checkFolderExists(newFolderName);
                if (exists) {
                    // If it exists, fetch the folder data and update the project
                    await fetchOneDriveData(newFolderName);
                    await updateProject({ ...project, oneDriveFolder: newFolderName });
                } else {
                    // If it doesn't exist, create the folder
                    await createFolder(newFolderName);
                }
            } catch (error) {
                console.error("Error updating OneDrive folder:", error);
            }
        }
    };
    if (!project) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="modal-overlay" onClick={closeModal}></div>
            <div className="modal">
                <span className="close" onClick={closeModal}>&times;</span>
                <div className="modal right-slide-modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <div className="project-header">
                            <div className="project-name-section">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Manage Roles Section */}
                        <div className="manage-roles">
                            <h3>Manage Roles:</h3>
                            <div className="roles-container">
                                <div className="available-roles">
                                    <h4>Available Roles:</h4>
                                    {userRoles.filter(role => !assignedRoles.includes(role)).map(role => ( // Filter out assigned roles
                                        <div key={role} className="role-item">
                                            <span className="role-name">{role}</span>
                                            <button onClick={() => addRole(role)} className="add-role-button">+</button>
                                        </div>
                                    ))}
                                </div>

                                <div className="assigned-roles">
                                    <h4>Assigned Roles:</h4>
                                    {assignedRoles.map(role => (
                                        <div key={role} className="role-item assigned-role-item">
                                            <span className="role-name">{role}</span>
                                            {userRoles.includes(role) && ( // Only show remove button if user has the role
                                                <button onClick={() => removeRole(role)} className="remove-role-button">-</button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="status-priority">
                            <div className="Status">
                                <label>Status:</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    <option value="New">New</option>
                                    <option value="Active">Active</option>
                                    <option value="Hold">Hold</option>
                                    <option value="End">End</option>
                                </select>
                            </div>
                            <div className="Lead">
                                <label>Lead:</label>
                                <input
                                    type="text"
                                    value={projectLead}
                                    onChange={(e) => setProjectLead(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="description-section">
                            <label>Description:</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a description for this task!"
                            />
                        </div>

                        <div className="comments-section">
                            <h4>Comments</h4>
                            <ul>
                                {project.comments && project.comments.map((c, index) => (
                                    <li key={index}><strong>{c.username}:</strong> {c.comment}</li>
                                ))}
                            </ul>

                            <form onSubmit={handleCommentSubmit}>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Your Name"
                                    required
                                />
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Your Comment"
                                    required
                                />
                                <button type="submit">Submit Comment</button>
                            </form>
                        </div>
                        <h2>Project Files</h2>
                        {folderData ? (
                            <FileTree data={folderData} accessOToken={accessOToken} oneDriveFolder={oneDriveFolder} changeFolder={changeFolder} updateFolder={updateFolder}/> // Pass folder data and accessOToken to FileTree
                        ) : (
                            <div>
                                <p>No OneDrive folder specified.</p>
                                <button onClick={updateFolder}>Set OneDrive Folder</button> {/* Button to set OneDrive folder */}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectDetails;