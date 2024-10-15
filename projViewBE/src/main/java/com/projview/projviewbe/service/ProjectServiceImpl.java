package com.projview.projviewbe.service;

import com.projview.projviewbe.dto.ProjectDto;
import com.projview.projviewbe.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    @Override
    public Set<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream().map(project -> {
            return ProjectDto.builder()
                    .id(project.getId())
                    .name(project.getName())
                    .description(project.getDescription())
                    .build();
        }).collect(Collectors.toSet());
    }
}
