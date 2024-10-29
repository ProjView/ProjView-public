import React, { useState, useEffect,useRef } from "react";
import './FileTree.css';

const FileTree = ({ accessToken, oneDriveFolder, changeFolder }) => {
    const [data, setData] = useState([]);
    const [openFolders, setOpenFolders] = useState({});
    const [currentPath, setCurrentPath] = useState([oneDriveFolder]);
    const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedNode: null });
    const [uploadFile, setUploadFile] = useState(null);
    const contextMenuRef = useRef(null); // Create a ref for the context menu

    useEffect(() => {
        if (contextMenu.visible && contextMenuRef.current) {
            const menuWidth = contextMenuRef.current.getBoundingClientRect().width;
            // Adjust the x position based on the actual width of the menu
            if (contextMenu.x + menuWidth > window.innerWidth) {
                setContextMenu(prev => ({
                    ...prev,
                    x: window.innerWidth - menuWidth - 5 // Adjust to fit
                }));
            }
        }
    }, [contextMenu.visible]);
    
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

    const goBack = () => {
        if (currentPath.length > 1) {
            const newPath = currentPath.slice(0, -1);
            setCurrentPath(newPath);
        }
    };

    // const goToProjectFolder = () => {
    //     setCurrentPath([oneDriveFolder]);
    // };

    const handleContextMenu = (e, node) => {
        e.preventDefault();
        
        const y = e.clientY; // Get the mouse Y position
        const containerRect = e.currentTarget.getBoundingClientRect(); // Get the bounding rectangle of the container
    
        // Calculate the x position relative to the container
        const x = e.clientX - containerRect.left + 5; // Add a small offset
        
        // Update state to show the context menu
        setContextMenu({ 
            visible: true, 
            x: x+60, // Offset to the right of the mouse click
            y: y, // Adjust Y position if needed
            selectedNode: node // This will be null for the "..."
        });
    };
    
    const handleCloseContextMenu = () => {
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${contextMenu.selectedNode.name}?`);
        if (confirmDelete) {
            try {
                const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${contextMenu.selectedNode.id}`, {
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
            handleCloseContextMenu();
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

    const handleRename = async () => {
        const newName = prompt("Enter new name:", contextMenu.selectedNode.name);
        if (newName) {
            try {
                const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${contextMenu.selectedNode.id}`, {
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
            handleCloseContextMenu();
        }
    };

    const renderTree = (nodes) => (
        <ul className="file-tree">
            <li className="file-tree-node">
                <span 
                    onClick={goBack} 
                    onContextMenu={(e) => handleContextMenu(e, null)} // Pass null for the context menu
                    style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                    ...
                </span>
            </li>
            {nodes.map((node) => {
                const isFolder = node.folder !== undefined; // Check if the node is a folder
                const hasChildren = isFolder && node.folder.childCount > 0; // Determine if it has children
                const isOpen = openFolders[node.id];
    
                return (
                    <li key={node.id} className="file-tree-node" onContextMenu={(e) => handleContextMenu(e, node)}>
                        <span onClick={() => toggleFolder(node)} className={`file-tree-item ${isFolder ? 'folder' : 'file'}`}>
                            {isFolder ? '📁' : '📄'} {node.name}
                        </span>
                    </li>
                );
            })}
        </ul>
    );

    const shortenPath = (path, maxLength) => {
        const fullPath = path.join(' / ');
        if (fullPath.length <= maxLength) {
            return fullPath;
        }
    
        const start = path[0];
        const end = path[path.length - 1];
        return `${start} / ... / ${end}`;
    };

    const handleDownload = async () => {
        const fileId = contextMenu.selectedNode.id; // Get the selected file's ID
        const downloadUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/content`; // Construct the download URL
    
        try {
            const response = await fetch(downloadUrl, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Include the access token in the headers
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const blob = await response.blob(); // Get the file as a blob
                const url = window.URL.createObjectURL(blob); // Create a URL for the blob
                const a = document.createElement('a'); // Create an anchor element
                a.href = url; // Set the href to the blob URL
                a.download = contextMenu.selectedNode.name; // Set the download attribute with the file name
                document.body.appendChild(a); // Append the anchor to the body
                a.click(); // Programmatically click the anchor to trigger the download
                a.remove(); // Remove the anchor from the document
                window.URL.revokeObjectURL(url); // Release the blob URL
            } else {
                console.error("Failed to download the file:", await response.json());
            }
        } catch (error) {
            console.error("Error downloading the file:", error);
        }
    
        handleCloseContextMenu(); // Close the context menu after initiating download
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
                    fetchFolderContents(currentPath.join('/')); // Refresh the folder contents
                } else {
                    console.error("Failed to create the folder");
                }
            } catch (error) {
                console.error("Error creating the folder:", error);
            }
            handleCloseContextMenu(); // Close the context menu after creating
        }
    };    
    
    const changeHomeFolder = async () => {
        const newFolderName = prompt("Enter the new OneDrive folder name:");
        if (newFolderName) { // Check if the user entered a name
            await changeFolder(newFolderName); // Wait for the folder change to complete
            setCurrentPath([newFolderName]); // Wrap newFolderName in an array before setting
            
            // Fetch folder contents using the new folder name
            fetchFolderContents(newFolderName); 
            handleCloseContextMenu(); // Close the context menu if it's open
        }
    };

    return (
        <div className="file-tree-container" onClick={handleCloseContextMenu}>
            <h3>Current Path: {shortenPath(currentPath, 30)}</h3>
            <div className="button-container">
                <input type="file" onChange={(e) => setUploadFile(e.target.files[0])} />
                {uploadFile && ( // Only show the button if a file is selected
                <button className="small-button" onClick={handleUpload}>
                    Upload
                </button>
            )}
                {/* Probably not needed */}
                {/* <button className="nav-button" onClick={goToProjectFolder}>Go to {oneDriveFolder}</button> */} 
            </div>
            {renderTree(data)}
            {contextMenu.visible && (
                <div 
                    className="file-menu" 
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {contextMenu.selectedNode === null ? ( // Check if the selected node is null 
                    <>
                        <button onClick={handleCreateFolder}>Create Folder</button> 
                        <button onClick={changeHomeFolder}>Change home folder</button>
                    </>
                    ) : (
                        <>
                            <button onClick={handleRename}>Rename</button>
                            <button onClick={handleDelete}>Delete</button>
                            {!contextMenu.selectedNode.folder && (
                                <button onClick={handleDownload}>Download</button>
                            )}
                            <button onClick={handleCreateFolder}>Create Folder</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default FileTree;
