package com.example.ProjViewAPI.service;

import com.example.ProjViewAPI.POJO.ProjectDto;
import com.example.ProjViewAPI.entity.Project;

import java.util.List;

public interface ProjectService {

    List<ProjectDto> getAllProjects();

    ProjectDto addProject(Project project);

    void deleteProject(Long id);

    List<ProjectDto> addProjects(List<Project> projects);

    Project getProjectById(Long id);

    ProjectDto updateProject(Long id, Project updatedProject);

    List<ProjectDto> getAllProjects(Long group);
}
