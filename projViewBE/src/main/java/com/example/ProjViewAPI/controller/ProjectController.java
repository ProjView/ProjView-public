package com.example.ProjViewAPI.controller;

import com.example.ProjViewAPI.ProjectService;
import com.example.ProjViewAPI.entity.Project;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuthorization")
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(@RequestBody Project project) {
        return projectService.addProject(project);
    }

    @PostMapping("/bulk") // New endpoint for bulk creation
    @ResponseStatus(HttpStatus.CREATED)
    public List<Project> createProjects(@RequestBody List<Project> projects) {
        return projectService.addProjects(projects); // Call the service method for bulk addition
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        return projectService.updateProject(id, updatedProject);
    }
}