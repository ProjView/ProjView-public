import React, { useState } from 'react';
import './AddProjectModal.css';
import { BASE_URL } from "./authConfig"; // Import the named exports

const AddProjectModal = ({ isOpen, onClose, token }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('Active');
  const [lead, setLead] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !lead) {
      setError('Please fill out all required fields.');
      return;
    }
    setError('');

    const project = {
      name,
      type,
      lead,
      url: url || null,
      group: 0
    };

    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(project)
      });

      if (response.ok) {
        const createdProject = await response.json();
      } else {
        throw new Error('Failed to create project');
      }
      onClose();
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-contentAdd">
        <h2 id="new_proj">Add a New Project</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          {/* Form fields here */}
          <div className="form-group">
            <label htmlFor="project-name">Project Name*</label>
            <input
              id="project-name"
              type="text"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-type">Project Status*</label>
            <select
              id="project-status"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="New">Inactive</option>
              <option value="Hold">Hold</option>
              <option value="End">Ended</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="project-lead">Project Lead*</label>
            <input
              id="project-lead"
              type="text"
              placeholder="Enter project lead's name"
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="project-url">Project URL (optional)</label>
            <input
              id="project-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div className="button-group">
            <button type="submit">Create Project</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal;