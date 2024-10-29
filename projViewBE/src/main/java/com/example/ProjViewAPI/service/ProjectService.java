package com.example.ProjViewAPI.service;

import com.example.ProjViewAPI.entity.Project;
import com.example.ProjViewAPI.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project addProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public List<Project> addProjects(List<Project> projects) {
        for (Project project : projects) {
            addProject(project); // Assuming addProject handles the individual project addition
        }
        return projects; // Return the list of added projects
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public Project updateProject(Long id, Project updatedProject) {
        Project existingProject = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        existingProject.setName(updatedProject.getName());
        existingProject.setType(updatedProject.getType());
        existingProject.setLead(updatedProject.getLead());
        existingProject.setUrl(updatedProject.getUrl());
        existingProject.setDescription(updatedProject.getDescription());
        existingProject.setOneDriveFolder(updatedProject.getOneDriveFolder());
        // Update other fields as necessary
        return projectRepository.save(existingProject);
    }
}