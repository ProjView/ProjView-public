package com.example.ProjViewAPI.entity;

import java.util.Set;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "projectsapi")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private String lead;
    private String url;
    @Column(name = "one_drive_folder") // Map to the corresponding column name in the database
    private String OneDriveFolder;
    @Column(name = "project_group") // Map to the corresponding column name in the database
    private Integer group; // Change to Set<String> for group

    @Column(length = 1000) // assuming description can be long
    private String description;
}
