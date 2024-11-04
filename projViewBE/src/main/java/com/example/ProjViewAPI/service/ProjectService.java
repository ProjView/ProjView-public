package com.example.ProjViewAPI.service;

import com.example.ProjViewAPI.POJO.ProjectCreateRequest;
import com.example.ProjViewAPI.POJO.ProjectDto;
import com.example.ProjViewAPI.entity.Project;
import com.example.ProjViewAPI.enumeration.ProjectRole;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface ProjectService {

    List<ProjectDto> getAllProjects();

    ProjectDto addProject(ProjectCreateRequest projectCreateRequest, String jwtToken);

    void deleteProject(Long id);

//    List<ProjectDto> addProjects(List<Project> projects);

    ProjectDto getProjectById(Long id);

    ProjectDto updateProject(Long id, Project updatedProject);

    List<ProjectDto> getAllProjects(String jwtToken);

    ResponseEntity<String> addAuthorityToUser(String authorizationHeader, Long projectId, ProjectRole authority);

    ResponseEntity<String> removeAuthorityToUser(String authorizationHeader, Long projectId, ProjectRole authority);

    ResponseEntity<String> addUserToProject(String jwtToken, Long projectId, String username);

    ResponseEntity<Set<ProjectRole>> getAuthorityFromUser(String jwtToken, Long projectId);
}
