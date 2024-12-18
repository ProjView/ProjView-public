package com.example.ProjViewAPI.repository.nxt;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ProjViewAPI.model.Project;

public interface ProjectRepositoryNxt extends JpaRepository<Project, Long> {
}