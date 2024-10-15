package com.projview.projviewbe.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProjectDto {

    private Long id;

    private String name;

    private String description;
}
