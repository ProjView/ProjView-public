// src/ProjectDetails.js
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";
import './ProjectDetails.css'; // Import the CSS for styling

const ProjectDetails = ({ projectId, onClose, refreshProjects }) => {
    const [project, setProject] = useState(null); // State to hold project details
    const [username, setUsername] = useState(""); // State for username
    const [comment, setComment] = useState(""); // State for comment
    const [selectedStatus, setSelectedStatus] = useState(""); // State for selected status
    const [projectLead, setProjectLead] = useState(""); // State for project lead
    const [projectName, setProjectName] = useState(""); // State for project name
    const [description, setDescription] = useState(""); // State for project description


    useEffect(() => {
        const fetchProjectDetails = async () => {
            const docRef = doc(db, "projects", projectId); // Use projectId prop
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const projectData = docSnap.data();
                setProject({ id: docSnap.id, ...projectData });
                setProjectName(projectData.title || ""); // Set initial project name
                setProjectLead(projectData.lead || ""); // Set initial project lead
                setDescription(projectData.description || "");
                setSelectedStatus(projectData.status || "New");
            } else {
                console.error("No such document!");
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    const updateProject = async (updatedData) => {
        const docRef = doc(db, "projects", projectId);
        await updateDoc(docRef, updatedData);
        const updatedDocSnap = await getDoc(docRef);
        setProject({ id: updatedDocSnap.id, ...updatedDocSnap.data() });
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (username.trim() && comment.trim()) {
            const docRef = doc(db, "projects", projectId);
            await updateDoc(docRef, {
                comments: arrayUnion({ username, comment })
            });
            setComment("");
            setUsername("");
            const updatedDocSnap = await getDoc(docRef);
            setProject({ id: updatedDocSnap.id, ...updatedDocSnap.data() });
        }
    };
    const closeModal = () => {
        const updatedData = {
            title: projectName,
            lead: projectLead,
            status: selectedStatus,
            description: description,
        };
        updateProject(updatedData);
        onClose();
        document.body.classList.remove("modal-open");
    };

    if (!project) {
        return <div>Loading...</div>;
    }
    const handleProjectUpdate = () => {
        const updatedData = {
            title: projectName,
            lead: projectLead,
            status: selectedStatus,
            description: description,
        };
        updateProject(updatedData);
    };

    return (
        <>
            <div className="modal-overlay" onClick={closeModal}></div>
            <div className="modal">
                <span className="close" onClick={closeModal}>&times;</span>
                <div className="modal right-slide-modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => { onClose(); }}>&times;</span>
                        <h2>                        
                            {/* Project Name Field */}
                            <div className="project-name-section">
                            <label>Name:</label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => {
                                        setProjectName(e.target.value);
                                        handleProjectUpdate(); // Update on change
                                    }}
                                />
                            </div></h2>
                        <div className="status-priority">
                            <div className="Status">
                                <label>Status:</label>
                                <select
                                value={selectedStatus}
                                onChange={(e) => {
                                    setSelectedStatus(e.target.value);
                                    handleProjectUpdate(); // Update on change
                                }}
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
                                onChange={(e) => {
                                    setProjectLead(e.target.value);
                                    handleProjectUpdate(); // Update on change
                                }}
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectDetails;
