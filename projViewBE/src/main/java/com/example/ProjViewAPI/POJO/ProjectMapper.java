package com.example.ProjViewAPI.POJO;


import com.example.ProjViewAPI.entity.Project;

import java.util.List;
import java.util.stream.Collectors;

public class ProjectMapper {

    public static List<ProjectDto> projectListToDTO(List<Project> projects) {
        return projects.stream()
                .map(ProjectMapper::projectEntityToDto)
                .collect(Collectors.toList());
    }

    public static ProjectDto projectEntityToDto(Project project) {
        return ProjectDto.builder()
                .id(project.getId())
                .name(project.getName())
                .type(project.getType())
                .lead(project.getLead())
                .url(project.getUrl())
                .OneDriveFolder(project.getOneDriveFolder())
                .description(project.getDescription())
                .group(project.getGroup())
                .build();
    }
}
