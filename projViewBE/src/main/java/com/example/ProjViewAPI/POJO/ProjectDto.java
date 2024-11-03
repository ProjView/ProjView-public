package com.example.ProjViewAPI.POJO;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ProjectDto {

    private Long id;

    private String name;

    private String type;

    private String lead;

    private String url;

    private String OneDriveFolder;

    private String description;

    private Integer group;
}
