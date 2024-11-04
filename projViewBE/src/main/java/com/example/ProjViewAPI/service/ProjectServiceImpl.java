package com.example.ProjViewAPI.service;

import com.example.ProjViewAPI.POJO.ProjectCreateRequest;
import com.example.ProjViewAPI.POJO.ProjectDto;
import com.example.ProjViewAPI.POJO.ProjectMapper;
import com.example.ProjViewAPI.entity.Project;
import com.example.ProjViewAPI.entity.User;
import com.example.ProjViewAPI.entity.UsersRoles;
import com.example.ProjViewAPI.enumeration.ProjectRole;
import com.example.ProjViewAPI.exception.ProjectException;
import com.example.ProjViewAPI.repository.ProjectRepository;
import com.example.ProjViewAPI.repository.UserRepository;
import com.example.ProjViewAPI.security.TokenManager;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;

@RequiredArgsConstructor
@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    private final UserRepository userRepository;

    private final TokenManager tokenManager;

    @Override
    public List<ProjectDto> getAllProjects() {
        return ProjectMapper.projectListToDTO(projectRepository.findAll());
    }

    @Override
    public List<ProjectDto> getAllProjects(String jwtToken) {
        String username = this.tokenManager.getUsernameFromToken(jwtToken);
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new ProjectException("User not found", HttpStatus.NOT_FOUND.value());
        }
        return ProjectMapper.projectListToDTO(projectRepository.findAllByUserId(userOptional.get().getId()));
    }

    @Override
    public ProjectDto addProject(ProjectCreateRequest projectCreateRequest, String jwtToken) {
        String username = this.tokenManager.getUsernameFromToken(jwtToken);
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new ProjectException("User not found", HttpStatus.NOT_FOUND.value());
        }
        Project project = Project.builder()
                .name(projectCreateRequest.getName())
                .type(projectCreateRequest.getType())
                .lead(projectCreateRequest.getLead())
                .url(projectCreateRequest.getUrl())
                .OneDriveFolder(projectCreateRequest.getOneDriveFolder())
                .description(projectCreateRequest.getDescription())
                .users(new HashSet<>())
                .userRoles(new HashMap<>())
                .build();
        project.getUsers().add(userOptional.get());
        Set<ProjectRole> projectRoles = new HashSet<>();
        projectRoles.add(ProjectRole.PROJECTMANAGER);
        project.getUserRoles().put(userOptional.get(), new UsersRoles(projectRoles));

        return ProjectMapper.projectEntityToDto(projectRepository.save(project));
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

//    @Override
//    public List<ProjectDto> addProjects(List<Project> projects) {
//        for (Project project : projects) {
//            addProject(project); // Assuming addProject handles the individual project addition
//        }
//        return ProjectMapper.projectListToDTO(projects); // Return the list of added projects
//    }

    @Override
    public ProjectDto getProjectById(Long id) {
        Optional<Project> projectOptional = projectRepository.findById(id);
        if (projectOptional.isEmpty()) {
            throw new ProjectException("Project not found", HttpStatus.NOT_FOUND.value());
        }
        return ProjectMapper.projectEntityToDto(projectOptional.get());
    }

    @Override
    public ProjectDto updateProject(Long id, ProjectDto updatedProject) {
        Project existingProject = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        existingProject.setName(updatedProject.getName());
        existingProject.setType(updatedProject.getType());
        existingProject.setLead(updatedProject.getLead());
        existingProject.setUrl(updatedProject.getUrl());
        existingProject.setDescription(updatedProject.getDescription());
        existingProject.setOneDriveFolder(updatedProject.getOneDriveFolder());
//        existingProject.setGroup(updatedProject.getGroup());

        // Update other fields as necessary
        return ProjectMapper.projectEntityToDto(projectRepository.save(existingProject));
    }

    @Override
    public ResponseEntity<String> addAuthorityToUser(String jwtToken, Long projectId, ProjectRole authority) {
        String username = this.tokenManager.getUsernameFromToken(jwtToken);
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new ProjectException("User not found", HttpStatus.NOT_FOUND.value());
        }
        Optional<Project> projectOptional = projectRepository.findById(projectId);
        if (projectOptional.isEmpty()) {
            throw new ProjectException("Project not found", HttpStatus.NOT_FOUND.value());
        }
        UsersRoles usersRoles = projectOptional.get().getUserRoles().get(userOptional.get());
        if (usersRoles == null) {
            throw new ProjectException("User is not part of this project", 403);
        }
        usersRoles.getUserRoles().add(authority);
        projectRepository.save(projectOptional.get());

        return ResponseEntity.ok().body("Authority added successfully: " + authority);
    }

    @Override
    public ResponseEntity<String> removeAuthorityToUser(String jwtToken, Long projectId, ProjectRole authority) {
        String username = this.tokenManager.getUsernameFromToken(jwtToken);
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new ProjectException("User not found", HttpStatus.NOT_FOUND.value());
        }
        Optional<Project> projectOptional = projectRepository.findById(projectId);
        if (projectOptional.isEmpty()) {
            throw new ProjectException("Project not found", HttpStatus.NOT_FOUND.value());
        }
        UsersRoles usersRoles = projectOptional.get().getUserRoles().get(userOptional.get());
        usersRoles.getUserRoles().remove(authority);
        projectRepository.save(projectOptional.get());

        return ResponseEntity.ok().body("Authority removed successfully: " + authority);
    }

    @Override
    public ResponseEntity<Set<ProjectRole>> getAuthorityFromUser(String jwtToken, Long projectId) {
        String username = this.tokenManager.getUsernameFromToken(jwtToken);
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            throw new ProjectException("User not found", HttpStatus.NOT_FOUND.value());
        }
        Optional<Project> projectOptional = projectRepository.findById(projectId);
        if (projectOptional.isEmpty()) {
            throw new ProjectException("Project not found", HttpStatus.NOT_FOUND.value());
        }
        UsersRoles usersRoles = projectOptional.get().getUserRoles().get(userOptional.get());
        return ResponseEntity.ok(usersRoles.getUserRoles());
    }

    @Override
    public ResponseEntity<String> addUserToProject(String jwtToken, Long projectId, String username) {
        String managerUsername = this.tokenManager.getUsernameFromToken(jwtToken);
        Optional<User> managerOptional = userRepository.findByUsername(managerUsername);
        if (managerOptional.isEmpty()) {
            throw new ProjectException("Manager not found", HttpStatus.NOT_FOUND.value());
        }
        Optional<Project> projectOptional = projectRepository.findById(projectId);
        if (projectOptional.isEmpty()) {
            throw new ProjectException("Project not found", HttpStatus.NOT_FOUND.value());
        }
        UsersRoles managerRoles = projectOptional.get().getUserRoles().get(managerOptional.get());
        if (managerRoles == null) {
            throw new ProjectException("Manager does not belong to project", HttpStatus.UNAUTHORIZED.value());
        }
        if (!managerRoles.getUserRoles().contains(ProjectRole.PROJECTMANAGER)) {
            throw new ProjectException("Only manager can add user to project", HttpStatus.UNAUTHORIZED.value());
        }
        Optional<User> userOptional = userRepository.findByUsername(managerUsername);
        if (userOptional.isEmpty()) {
            throw new ProjectException("User not found", HttpStatus.NOT_FOUND.value());
        }
        projectOptional.get().getUsers().add(userOptional.get());
        Set<ProjectRole> projectRoles = new HashSet<>();
        projectRoles.add(ProjectRole.USER);
        projectOptional.get().getUserRoles().put(userOptional.get(), new UsersRoles(projectRoles));
        return ResponseEntity.ok("User: " + username + ", was added to project successfully");
    }
}