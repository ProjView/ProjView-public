import React, { useState, useEffect } from "react";
import { Button, Dropdown, Breadcrumb, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolder, faPlus, faFile, faFilePdf, faFileWord, faFileExcel, faFileImage, faFileAlt, faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import './FileTree.css';

const FileTree = ({ accessToken, oneDriveFolder, changeFolder, setShowFolderModal }) => {
    const [data, setData] = useState([]);
    const [openFolders, setOpenFolders] = useState({});
    const [currentPath, setCurrentPath] = useState([oneDriveFolder]);
    const [uploadFile, setUploadFile] = useState(null);

    useEffect(() => {
        fetchFolderContents(currentPath.join('/'));
    }, [currentPath]);

    const fetchFolderContents = async (folderPath) => {
        if (!accessToken) return;
        try {
            const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${folderPath}:/children`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.ok) {
                const result = await response.json();
                setData(result.value);
            } else {
                console.error("Failed to fetch folder contents");
            }
        } catch (error) {
            console.error("Error fetching folder contents:", error);
        }
    };

    const toggleFolder = (node) => {
        setOpenFolders((prev) => ({ ...prev, [node.id]: !prev[node.id] }));
        if (!openFolders[node.id]) {
            setCurrentPath((prev) => [...prev, node.name]);
            fetchFolderContents(`${currentPath.join('/')}/${node.name}`);
        }
    };

    const handleDelete = async (node) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${node.name}?`);
        if (confirmDelete) {
            try {
                const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${node.id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (response.ok) {
                    fetchFolderContents(currentPath.join('/'));
                } else {
                    console.error("Failed to delete the item");
                }
            } catch (error) {
                console.error("Error deleting the item:", error);
            }
        }
    };

    const handleUpload = async () => {
        if (uploadFile) {
            try {
                const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${currentPath.join('/')}/${uploadFile.name}:/content`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: uploadFile,
                });
                if (response.ok) {
                    fetchFolderContents(currentPath.join('/'));
                } else {
                    console.error("Failed to upload the file");
                }
            } catch (error) {
                console.error("Error uploading the file:", error);
            }
            setUploadFile(null);
        }
    };

    const handleRename = async (node) => {
        const newName = prompt("Enter new name:", node.name);
        if (newName) {
            try {
                const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${node.id}`, {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: newName }),
                });
                if (response.ok) {
                    fetchFolderContents(currentPath.join('/'));
                } else {
                    console.error("Failed to rename the item");
                }
            } catch (error) {
                console.error("Error renaming the item:", error);
            }
        }
    };

    const handleDownload = async (node) => {
        const fileId = node.id;
        const downloadUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`;
        try {
            const response = await fetch(downloadUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = node.name;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                console.error("Failed to download the file:", await response.json());
            }
        } catch (error) {
            console.error("Error downloading the file:", error);
        }
    };

    const handleCreateFolder = async () => {
        const folderName = prompt("Enter folder name:");
        if (folderName) {
            try {
                const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/root:/${currentPath.join('/')}/${folderName}:/`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name: folderName, folder: {} }),
                });
                if (response.ok) {
                    fetchFolderContents(currentPath.join('/'));
                } else {
                    console.error("Failed to create the folder");
                }
            } catch (error) {
                console.error("Error creating the folder:", error);
            }
        }
    };

    const changeHomeFolder = async () => {
        // Instead of using a prompt, we will use the modal to select folders
        setShowFolderModal(true); // Show the folder selection modal
    };

    const getFileIcon = (filename) => {
        const extension = filename.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf':
                return <FontAwesomeIcon icon={faFilePdf} style={{ color: '#dc3545' }} />;
            case 'docx':
                return <FontAwesomeIcon icon={faFileWord} style={{ color: '#007bff' }} />;
            case 'xlsx':
                return <FontAwesomeIcon icon={faFileExcel} style={{ color: '#28a745' }} />;
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return <FontAwesomeIcon icon={faFileImage} />;
            case 'txt':
            case 'md':
                return <FontAwesomeIcon icon={faFileAlt} style={{ color: '#6c757d' }} />;
            default:
                return <FontAwesomeIcon icon={faFile} />;
        }
    };

    const renderAddNewDropdown = () => (
        <Dropdown>
            <Dropdown.Toggle variant="success" className="rounded-pill" id="dropdown-add-new" style={{ boxShadow: "none" }}>
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Add New
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={handleCreateFolder}>Create Folder</Dropdown.Item>
                <Dropdown.Item onClick={() => document.getElementById('file-upload-input').click()}>Upload File</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );

    const renderTree = (nodes) => (
        <div className="scrollable-tree">
            <ListGroup>
                {nodes.map((node) => {
                    const isFolder = node.folder !== undefined;
                    const isOpen = openFolders[node.id];
                    const folderIcon = <FontAwesomeIcon icon={faFolder} style={{ color: '#ffc107', filter: 'drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.3))' }} />;
                    const fileIcon = node.file ? getFileIcon(node.name) : folderIcon;

                    return (
                        <ListGroup.Item key={node.id} className="d-flex justify-content-between align-items-center cursor-pointer">
                            <div className="d-flex align-items-center cursor-pointer" onClick={() => isFolder && toggleFolder(node)}>
                                {fileIcon} <span className="ms-2">{node.name}</span>
                            </div>
                            <Dropdown align="end">
                                <Dropdown.Toggle
                                    variant="link"
                                    className="text-dark p-0"
                                    id={`dropdown-${node.id}`}
                                    style={{ boxShadow: "none" }}
                                >
                                    <FontAwesomeIcon icon={faEllipsisH} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleRename(node)}>Rename</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleDelete(node)}>Delete</Dropdown.Item>
                                    {!node.folder && (
                                        <Dropdown.Item onClick={() => handleDownload(node)}>Download</Dropdown.Item>
                                    )}
                                </Dropdown.Menu>
                            </Dropdown>
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        </div>
    );

    return (
        <div>
            <div className="row align-items-center mb-3">
                <div className="col-auto">
                    <Button variant="outline-primary" className="rounded-pill" onClick={changeHomeFolder}>
                        Change Home Folder
                    </Button>
                </div>
                <div className="col-auto ms-auto">
                    {renderAddNewDropdown()}
                </div>
            </div>

            <div className="row align-items-center mb-3">
                <div className="col-auto">
                    <h5 className="m-0">Current Path:</h5>
                </div>
                <div className="col">
                    <Breadcrumb className="m-0 h5">
                        {currentPath.map((folder, idx) => (
                            <Breadcrumb.Item
                                key={idx}
                                onClick={() => setCurrentPath(currentPath.slice(0, idx + 1))}
                                active={idx === currentPath.length - 1}
                            >
                                {folder}
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                </div>
            </div>
            {/* File Upload Input (hidden) */}
            <input
                id="file-upload-input"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => handleUpload(e.target.files[0])}
            />
            {renderTree(data)}
        </div>
    );
};

export default FileTree;
