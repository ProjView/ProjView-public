package com.example.ProjViewAPI.service;

import com.example.ProjViewAPI.POJO.ProjectDto;
import com.example.ProjViewAPI.POJO.ProjectMapper;
import com.example.ProjViewAPI.entity.Project;
import com.example.ProjViewAPI.exception.ProjectException;
import com.example.ProjViewAPI.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
public class ProjectServiceImpl implements ProjectService{

    private final ProjectRepository projectRepository;

    @Override
    public List<ProjectDto> getAllProjects() {
        return ProjectMapper.projectListToDTO(projectRepository.findAll());
    }

    @Override
    public List<ProjectDto> getAllProjects(Long group) {
        return ProjectMapper.projectListToDTO(projectRepository.findByGroup(group));
    }

    @Override
    public ProjectDto addProject(Project project) {
        return ProjectMapper.projectEntityToDto(projectRepository.save(project));
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    @Override
    public List<ProjectDto> addProjects(List<Project> projects) {
        for (Project project : projects) {
            addProject(project); // Assuming addProject handles the individual project addition
        }
        return ProjectMapper.projectListToDTO(projects); // Return the list of added projects
    }

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Override
    public ProjectDto updateProject(Long id, Project updatedProject) {
        Project existingProject = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        existingProject.setName(updatedProject.getName());
        existingProject.setType(updatedProject.getType());
        existingProject.setLead(updatedProject.getLead());
        existingProject.setUrl(updatedProject.getUrl());
        existingProject.setDescription(updatedProject.getDescription());
        existingProject.setOneDriveFolder(updatedProject.getOneDriveFolder());
        existingProject.setGroup(updatedProject.getGroup());
        
        // Update other fields as necessary
        return ProjectMapper.projectEntityToDto(projectRepository.save(existingProject));
    }
}