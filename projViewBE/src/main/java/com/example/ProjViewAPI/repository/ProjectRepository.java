package com.example.ProjViewAPI.repository;

import com.example.ProjViewAPI.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}