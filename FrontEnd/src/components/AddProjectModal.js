import React, { useState } from 'react';
import './AddProjectModal.css';
import { BASE_URL } from "../auth/authConfig"; // Import the named exports
import { Modal, Button, Form, Alert } from "react-bootstrap";

const AddProjectModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('New');
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
    };

    try {
      const response = await fetch(`${BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(project)
      });

      if (response.ok) {
        const createdProject = await response.json();
        onClose(type, createdProject.id); // Pass the new project's status to onClose
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      setError('Error: ' + error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      dialogClassName="add-modal-width"
    >
      <Modal.Header closeButton>
        <Modal.Title>Add a New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Error Alert */}
        {error && (
          <Alert variant="danger" onClose={() => setError("")} dismissible>
            {error}
          </Alert>
        )}

        {/* Form */}
        <Form style={{ width: '100%' }} onSubmit={handleSubmit}>
          {/* Project Name */}
          <Form.Group className="mb-3" controlId="project-name">
            <Form.Label>Project Name*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          {/* Project Status */}
          <Form.Group className="mb-3" controlId="project-status">
            <Form.Label>Project Status*</Form.Label>
            <Form.Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="New">New</option>
              <option value="Active">Active</option>
              <option value="Hold">Hold</option>
              <option value="End">Ended</option>
            </Form.Select>
          </Form.Group>

          {/* Project Lead */}
          <Form.Group className="mb-3" controlId="project-lead">
            <Form.Label>Project Lead*</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter project lead's name"
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              required
            />
          </Form.Group>

          {/* Project URL */}
          <Form.Group className="mb-3" controlId="project-url">
            <Form.Label>Project URL (optional)</Form.Label>
            <Form.Control
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </Form.Group>

          {/* Buttons */}
          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="btn btn-outline-secondary rounded-pill" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="btn btn-primary rounded-pill" type="submit">
              Create Project
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProjectModal;