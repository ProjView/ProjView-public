package com.example.ProjViewAPI;

import jakarta.persistence.*;
import java.util.List;

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
    private String oneDriveFolder;

    @Column(length = 1000) // assuming description can be long
    private String description;

    @ElementCollection
    @CollectionTable(name = "project_comments", joinColumns = @JoinColumn(name = "project_id"))
    private List<Comment> comments;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getLead() {
        return lead;
    }

    public void setLead(String lead) {
        this.lead = lead;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOneDriveFolder() {
        return oneDriveFolder;
    }

    public void setOneDriveFolder(String oneDriveFolder) {
        this.oneDriveFolder = oneDriveFolder;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }
}

@Embeddable
class Comment {
    private String username;
    private String comment;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}