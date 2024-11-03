package com.example.ProjViewAPI.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
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

    @ManyToMany
    @JoinTable(
            name = "project_users",
            joinColumns = @JoinColumn(name = "projectsapi_id"),
            inverseJoinColumns = @JoinColumn(name = "user_account_id"))
    private Set<User> users;

    @ElementCollection
    @CollectionTable(name = "user_project_authorities", joinColumns = @JoinColumn(name = "projectsapi_id"))
    @MapKeyJoinColumn(name = "user_account_id")
    @Column(name = "project_role_id")
    private Map<UserAccount, UsersRoles> userRoles = new HashMap<>();

    @Column(length = 1000) // assuming description can be long
    private String description;
}
