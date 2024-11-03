package com.example.ProjViewAPI.POJO;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProjectCreateRequest {

    private String name;

    private String type;

    private String lead;

    private String url;

    private String OneDriveFolder;

    private String description;
}
