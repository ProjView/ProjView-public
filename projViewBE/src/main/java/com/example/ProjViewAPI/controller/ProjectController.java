package com.example.ProjViewAPI.controller;

import com.example.ProjViewAPI.POJO.ProjectCreateRequest;
import com.example.ProjViewAPI.POJO.ProjectDto;
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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectDto createProject(
            @RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader,
            @RequestBody ProjectCreateRequest projectCreateRequest) {

        String jwtToken = authorizationHeader.substring("Bearer ".length()).trim();
        return projectService.addProject(projectCreateRequest, jwtToken);
    }

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
    public ProjectDto updateProject(@PathVariable Long id, @RequestBody ProjectDto updatedProject) {
//        return null;
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