// src/FileTree.js
import React, { useEffect, useState } from "react";

const FileTree = ({ accessToken }) => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            const response = await fetch("https://graph.microsoft.com/v1.0/me/drive/root/children", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            setFiles(data.value);
        };

        if (accessToken) {
            fetchFiles();
        }
    }, [accessToken]);

    const renderFiles = (files) => {
        return files.map(file => (
            <li key={file.id}>
                {file.name}
                {file.folder && file.folder.childCount > 0 && (
                    <FileTree accessToken={accessToken} folderId={file.id} />
                )}
            </li>
        ));
    };

    return (
        <ul>
            {renderFiles(files)}
        </ul>
    );
};

export default FileTree;
