package com.example.demo.controller;

import com.example.demo.model.Project;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
public class ProjectController {

    @GetMapping("/projects")
    public List<Project> getAllProjects() {
        return Arrays.asList(
                new Project(1L, "Project A", "Description A"),
                new Project(2L, "Project B", "Description B")
        );
    }
}
