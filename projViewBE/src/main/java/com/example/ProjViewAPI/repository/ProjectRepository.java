package com.example.ProjViewAPI.repository;

import com.example.ProjViewAPI.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    //    List<Project> findByGroup(Long group);
    @Query("SELECT p FROM Project p JOIN p.users u WHERE u.id = :userId")
    List<Project> findAllByUserId(@Param("userId") Long userId);

}