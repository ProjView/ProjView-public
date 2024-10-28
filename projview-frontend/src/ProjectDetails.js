import React, { useEffect, useState } from "react";
import FileTree from "./FileTree"; // Import the FileTree component
import './ProjectDetails.css'; // Import the CSS for styling


const ProjectDetails = ({ projectId, onClose, accessToken }) => {
    const [project, setProject] = useState(null); // State to hold project details
    const [username, setUsername] = useState(""); // State for username
    const [comment, setComment] = useState(""); // State for comment
    const [selectedStatus, setSelectedStatus] = useState(""); // State for selected status
    const [projectLead, setProjectLead] = useState(""); // State for project lead
    const [projectName, setProjectName] = useState(""); // State for project name
    const [description, setDescription] = useState(""); // State for project description
    const [folderData, setFolderData] = useState(null); // State to hold folder data
    const [oneDriveFolder, setOneDrivefolder] = useState(""); // State to hold oneDriveFolder name
    

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/projects/${projectId}`);
                const projectData = await response.json();
                setProject(projectData);
                setProjectName(projectData.name || ""); // Set initial project name
                setProjectLead(projectData.lead || ""); // Set initial project lead
                setDescription(projectData.description || "");
                setSelectedStatus(projectData.type || "New"); 
                setOneDrivefolder(projectData.oneDriveFolder || ""); // Set initial oneDriveFolder

                // Check if projectName is defined before fetching OneDrive data
                if (projectData.oneDriveFolder) {
                    fetchOneDriveData(projectData.oneDriveFolder);  
                }
            } catch (error) {
            console.error("Error fetching project details:", error);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    const fetchOneDriveData = async (oneDriveFolder) => {
        if (!accessToken) return; // Ensure access token is available

        try {
            const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${oneDriveFolder}:/children`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
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
            const response = await fetch(`http://localhost:8080/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
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
        };
        updateProject(updatedData);
        setTimeout(() => {
            onClose(); // Call onClose to refresh the project list and close the modal
            document.body.classList.remove("modal-open");
        }, 250); 
    };

    const checkFolderExists = async (oneDriveFolder) => {
        if (!accessToken) return false; // Ensure access token is available

        try {
            const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${oneDriveFolder}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
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
        if (!accessToken) return; // Ensure access token is available

        try {
            const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${newFolderName}:/`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
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
                        <h2>
                            <div className="project-name-section">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                />
                            </div>
                        </h2>
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
                            <FileTree data={folderData} accessToken={accessToken} oneDriveFolder={oneDriveFolder} changeFolder={changeFolder} updateFolder={updateFolder}/> // Pass folder data and accessToken to FileTree
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