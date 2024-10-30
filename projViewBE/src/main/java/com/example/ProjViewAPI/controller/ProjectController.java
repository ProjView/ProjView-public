package com.example.ProjViewAPI.controller;

import com.example.ProjViewAPI.POJO.ProjectDto;
import com.example.ProjViewAPI.entity.Project;
import com.example.ProjViewAPI.service.ProjectServiceImpl;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@SecurityRequirement(name = "bearerAuthorization")
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectServiceImpl projectService;

    @GetMapping
    public List<ProjectDto> getAllProjects() {
        return projectService.getAllProjects();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDto createProject(@RequestBody Project project) {
        return projectService.addProject(project);
    }

    @PostMapping("/bulk") // New endpoint for bulk creation
    @ResponseStatus(HttpStatus.CREATED)
    public List<ProjectDto> createProjects(@RequestBody List<Project> projects) {
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
    public ProjectDto updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        return projectService.updateProject(id, updatedProject);
    }
}