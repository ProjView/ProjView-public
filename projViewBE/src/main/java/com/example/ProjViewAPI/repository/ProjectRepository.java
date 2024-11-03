package com.example.ProjViewAPI.repository;

import com.example.ProjViewAPI.entity.Project;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByGroup(Long group);
}