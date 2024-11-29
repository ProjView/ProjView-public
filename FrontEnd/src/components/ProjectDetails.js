import React, { useEffect, useState } from "react";
import FileTree from "./FileTree"; // Import the FileTree component
import './ProjectDetails.css'; // Import the CSS for styling
import { BASE_URL } from "../auth/authConfig"; // Import the named exports
import { Modal, Button, Row, Col, Form, Spinner } from 'react-bootstrap';

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
    const [isLoadingOneDrive, setIsLoadingOneDrive] = useState(false); // State for loading indicator

    useEffect(() => {
        const fetchProjectDetails = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/projects/${projectId}`);
                const projectData = await response.json();
                console.log("Fetched project data:", projectData);
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
        
        setIsLoadingOneDrive(true); // Set loading state to true
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
        } finally {
            setIsLoadingOneDrive(false); // Set loading state to false once done
        }
    };

    const updateProject = async (updatedData, closeModal = true) => {
        try {
            console.log("Updating project with data:", updatedData);
            const response = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const updatedProject = await response.json();
                setProject(updatedProject);
                if (closeModal) {
                    onClose(updatedProject.type, updatedProject.id); // Call onClose to refresh the project list and close the modal
                }
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
        try {
            if (username.trim() && comment.trim()) {
                const newComment = { username, comment };
                const updatedComments = [...(project.comments || []), newComment];
                const updatedData = {
                    ...project,
                    comments: updatedComments
                };
                await updateProject(updatedData, false); // Pass false to prevent modal from closing
                setComment("");
                setUsername("");
                setProject(prevProject => ({
                    ...prevProject,
                    comments: updatedComments
                }));
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        }
    };

    const closeModal = async() => {
        const updatedData = {
            name: projectName,
            lead: projectLead,
            type: selectedStatus,
            description: description,
            oneDriveFolder: oneDriveFolder,
            comments: project.comments
        };
        updateProject(updatedData);
        setTimeout(() => {
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
        <Modal
            show
            onHide={closeModal}
            dialogClassName="details-modal-width"
            centered
            scrollable={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Project Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body">
                <Row style={{ width: "100%" }}>
                    {/* Left Section: Project Form */}
                    <Col md={6} className="left-section">
                        <Form>
                            <div className="d-flex gap-3 mb-3">
                                <Form.Group className="flex-fill">
                                    <Form.Label>Project Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="flex-fill">
                                    <Form.Label>Project Lead</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={projectLead}
                                        onChange={(e) => setProjectLead(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="flex-fill">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select
                                        value={selectedStatus}
                                        onChange={(e) => setSelectedStatus(e.target.value)}
                                    >
                                        <option value="New">New</option>
                                        <option value="Active">Active</option>
                                        <option value="Hold">Hold</option>
                                        <option value="End">End</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>

                            {/* Description */}
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </Form.Group>

                            {/* Comments Section */}
                            <Form.Group>
                                <Form.Label>Comments</Form.Label>
                                <div className="comments-section">
                                    <ul className="list-unstyled">
                                        {project.comments &&
                                            project.comments.map((c, index) => (
                                                <li key={index}>
                                                    <strong>{c.username}:</strong> {c.comment}
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                                <Form.Control
                                    className="mb-2"
                                    type="text"
                                    placeholder="Your Name"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                <Form.Control
                                    className="mb-2"
                                    as="textarea"
                                    rows={2}
                                    placeholder="Your Comment"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <Button variant="primary" className="rounded-pill" onClick={handleCommentSubmit}>
                                    Submit Comment
                                </Button>
                            </Form.Group>
                        </Form>
                    </Col>

                    {/* Right Section: OneDrive Folder */}
                    <Col md={6} className="right-section">
                        {/* <h4>Project Files</h4> */}
                        <Form.Label>Project Files</Form.Label>
                        <div className="project-files-container">
                            {isLoadingOneDrive ? (
                                <div className="d-flex justify-content-center">
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : folderData ? (
                                <FileTree
                                    data={folderData}
                                    accessToken={accessToken}
                                    oneDriveFolder={oneDriveFolder}
                                    changeFolder={changeFolder}
                                    updateFolder={updateFolder}
                                />
                            ) : (
                                <div>
                                    <p>No OneDrive folder specified.</p>
                                    <Button variant="secondary" className="rounded-pill" onClick={updateFolder}>
                                        Set OneDrive Folder
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" className="rounded-pill" onClick={closeModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProjectDetails;