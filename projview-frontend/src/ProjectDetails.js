import React, { useEffect, useState } from "react";
import FileTree from "./FileTree"; // Import the FileTree component
import { PublicClientApplication } from "@azure/msal-browser"; // Import MSAL
import authConfig from "./authConfig"; // Import your auth config
import './ProjectDetails.css'; // Import the CSS for styling

const msalInstance = new PublicClientApplication(authConfig); // Create a new MSAL instance

const ProjectDetails = ({ projectId, onClose, refreshProjects }) => {
    const [project, setProject] = useState(null); // State to hold project details
    const [username, setUsername] = useState(""); // State for username
    const [comment, setComment] = useState(""); // State for comment
    const [selectedStatus, setSelectedStatus] = useState(""); // State for selected status
    const [projectLead, setProjectLead] = useState(""); // State for project lead
    const [projectName, setProjectName] = useState(""); // State for project name
    const [description, setDescription] = useState(""); // State for project description
    const [accessToken, setAccessToken] = useState(null); // State for OneDrive access token


    // Initialize MSAL on component mount
    useEffect(() => {
        msalInstance.initialize().then(() => {
            console.log("MSAL Initialized");
            authenticateOneDrive(); // Call the authentication function after initialization
        }).catch(error => {
            console.error("MSAL Initialization error:", error);
        });
    }, []);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/projects/${projectId}`);
                const projectData = await response.json();
                setProject(projectData);
                setProjectName(projectData.name || ""); // Set initial project name
                setProjectLead(projectData.lead || ""); // Set initial project lead
                setDescription(projectData.description || "");
                setSelectedStatus(projectData.type || "New"); // Assuming "type" is your status field
            } catch (error) {
                console.error("Error fetching project details:", error);
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    const authenticateOneDrive = async () => {
        try {
            const response = await msalInstance.loginPopup({
                scopes: ["Files.ReadWrite", "User.Read"], // Define the scopes you need
            });
            const tokenResponse = await msalInstance.acquireTokenSilent({
                scopes: ["Files.ReadWrite", "User.Read"],
                account: response.account,
            });
            setAccessToken(tokenResponse.accessToken); // Set the access token
        } catch (error) {
            console.error("Authentication error:", error);
        }
    };

    useEffect(() => {
        authenticateOneDrive(); // Call the authentication function on mount
    }, []);

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

    const closeModal = () => {
        const updatedData = {
            name: projectName,
            lead: projectLead,
            type: selectedStatus,
            description: description,
        };
        updateProject(updatedData);
        onClose();
        document.body.classList.remove("modal-open");
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
                        {accessToken ? (
                            <FileTree accessToken={accessToken} /> // Render the FileTree component
                        ) : (
                            <p>Loading files...</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectDetails;