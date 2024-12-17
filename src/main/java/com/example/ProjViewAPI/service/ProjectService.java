package com.example.ProjViewAPI.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.example.ProjViewAPI.model.Project;
import com.example.ProjViewAPI.repository.nxt.ProjectRepositoryNxt;
import com.example.ProjViewAPI.repository.tuke.ProjectRepositoryTuke;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepositoryNxt projectRepositoryNxt;
    private final ProjectRepositoryTuke projectRepositoryTuke;

    @Autowired
    public ProjectService(@Qualifier("projectRepositoryNxt") ProjectRepositoryNxt projectRepositoryNxt,
                          @Qualifier("projectRepositoryTuke") ProjectRepositoryTuke projectRepositoryTuke) {
        this.projectRepositoryNxt = projectRepositoryNxt;
        this.projectRepositoryTuke = projectRepositoryTuke;
    }

    public List<Project> getAllProjects(boolean useTuke) {
        if (useTuke) {
            return projectRepositoryTuke.findAll();
        }
        return projectRepositoryNxt.findAll();
    }

    public Project addProject(Project project, boolean useTuke) {
        if (useTuke) {
            return projectRepositoryTuke.save(project);
        }
        return projectRepositoryNxt.save(project);
    }

    public void deleteProject(Long id, boolean useTuke) {
        if (useTuke) {
            projectRepositoryTuke.deleteById(id);
        } else {
            projectRepositoryNxt.deleteById(id);
        }
    }

    public List<Project> addProjects(List<Project> projects, boolean useTuke) {
        for (Project project : projects) {
            addProject(project, useTuke); // Assuming addProject handles the individual project addition
        }
        return projects; // Return the list of added projects
    }

    public Project getProjectById(Long id, boolean useTuke) {
        if (useTuke) {
            return projectRepositoryTuke.findById(id).orElseThrow(() -> new RuntimeException("Project not found in Tuke"));
        }
        return projectRepositoryNxt.findById(id).orElseThrow(() -> new RuntimeException("Project not found in Nxt"));
    }

    public Project updateProject(Long id, Project updatedProject, boolean useTuke) {
        Project existingProject;
        if (useTuke) {
            existingProject = projectRepositoryTuke.findById(id).orElseThrow(() -> new RuntimeException("Project not found in Tuke"));
        } else {
            existingProject = projectRepositoryNxt.findById(id).orElseThrow(() -> new RuntimeException("Project not found in Nxt"));
        }

        existingProject.setName(updatedProject.getName());
        existingProject.setType(updatedProject.getType());
        existingProject.setLead(updatedProject.getLead());
        existingProject.setUrl(updatedProject.getUrl());
        existingProject.setDescription(updatedProject.getDescription());
        existingProject.setOneDriveFolder(updatedProject.getOneDriveFolder());
        existingProject.setComments(updatedProject.getComments());
        existingProject.setJiraProjectId(updatedProject.getJiraProjectId());

        if (useTuke) {
            return projectRepositoryTuke.save(existingProject);
        }
        return projectRepositoryNxt.save(existingProject);
    }
}