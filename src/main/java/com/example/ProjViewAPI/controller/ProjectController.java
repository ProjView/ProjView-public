package com.example.ProjViewAPI.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.ProjViewAPI.model.Project;
import com.example.ProjViewAPI.service.ProjectService;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public List<Project> getAllProjects(@RequestParam(defaultValue = "false") boolean useTuke) {
        return projectService.getAllProjects(useTuke);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Project createProject(@RequestBody Project project, @RequestParam(defaultValue = "false") boolean useTuke) {
        return projectService.addProject(project, useTuke);
    }

    @PostMapping("/bulk") // New endpoint for bulk creation
    @ResponseStatus(HttpStatus.CREATED)
    public List<Project> createProjects(@RequestBody List<Project> projects, @RequestParam(defaultValue = "false") boolean useTuke) {
        return projectService.addProjects(projects, useTuke); // Call the service method for bulk addition
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable Long id, @RequestParam(defaultValue = "false") boolean useTuke) {
        projectService.deleteProject(id, useTuke);
    }

    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id, @RequestParam(defaultValue = "false") boolean useTuke) {
        return projectService.getProjectById(id, useTuke);
    }

    @PutMapping("/{id}")
    public Project updateProject(@PathVariable Long id, @RequestBody Project updatedProject, @RequestParam(defaultValue = "false") boolean useTuke) {
        return projectService.updateProject(id, updatedProject, useTuke);
    }
}
