package com.projview.projviewbe.repository;

import com.projview.projviewbe.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

}
