package com.example.ProjViewAPI.controller;

import com.example.ProjViewAPI.POJO.ProjectCreateRequest;
import com.example.ProjViewAPI.POJO.ProjectDto;
import com.example.ProjViewAPI.entity.Project;
import com.example.ProjViewAPI.enumeration.ProjectRole;
import com.example.ProjViewAPI.service.ProjectService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@SecurityRequirement(name = "bearerAuthorization")
// I currently don't know why but this temporarily fucks up everything for ProjectController, maybe it would be wise to comfront the OpenAPI documentation. It disables parameters when not authorized but after authorizing the parameters don't show up.
@RequiredArgsConstructor
@RequestMapping("/api/projects")
public class ProjectController {
    private final ProjectService projectService;

    @GetMapping("/all")
    public List<ProjectDto> getAllProjects() {
        return projectService.getAllProjects();
    }

    @PutMapping("/addUser")
    public ResponseEntity<String> addUserToProject(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestParam Long projectId,
            @RequestParam String username) {
        String jwtToken = authorizationHeader.substring("Bearer ".length()).trim();
        return projectService.addUserToProject(jwtToken, projectId, username);
    }

    @GetMapping
    public List<ProjectDto> getAllProjects(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        String jwtToken = authorizationHeader.substring("Bearer ".length()).trim();
        return projectService.getAllProjects(jwtToken);
    }

//    @GetMapping("/byGroup") // Use a different endpoint for getting projects by group
//    public List<ProjectDto> getAllProjectsByGroup(@RequestParam Long group) {
//        return projectService.getAllProjects(group);
//    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDto createProject(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestBody ProjectCreateRequest projectCreateRequest) {

        String jwtToken = authorizationHeader.substring("Bearer ".length()).trim();
        return projectService.addProject(projectCreateRequest, jwtToken);
    }


//    @PostMapping("/bulk") // New endpoint for bulk creation
//    @ResponseStatus(HttpStatus.CREATED)
//    public List<ProjectDto> createProjects(@RequestBody List<Project> projects) {
//        return projectService.addProjects(projects); // Call the service method for bulk addition
//    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
    }


    @GetMapping("/{id}")
    public ProjectDto getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }


    @PutMapping("/{id}")
    public ProjectDto updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        return projectService.updateProject(id, updatedProject);
    }

    @PostMapping("/addAuthority")
    public ResponseEntity<String> addAuthorityToUser(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestParam Long projectId,
            @RequestParam ProjectRole authority) {
        String jwtToken = authorizationHeader.substring("Bearer ".length()).trim();
        return projectService.addAuthorityToUser(jwtToken, projectId, authority);
    }

    @Transactional
    @SecurityRequirement(name = "bearerAuthorization")
    @DeleteMapping("/removeAuthority")
    public ResponseEntity<String> removeAuthorityFromUser(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestParam Long projectId,
            @RequestParam ProjectRole authority) {
        String jwtToken = authorizationHeader.substring("Bearer ".length()).trim();
        return projectService.removeAuthorityToUser(jwtToken, projectId, authority);
    }

    @SecurityRequirement(name = "bearerAuthorization")
    @GetMapping("/getAuthority")
    public ResponseEntity<Set<ProjectRole>> getAuthorityFromUser(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestParam Long projectId) {
        String jwtToken = authorizationHeader.substring("Bearer ".length()).trim();
        return projectService.getAuthorityFromUser(jwtToken, projectId);
    }
}