package com.example.ProjViewAPI.repository;

import com.example.ProjViewAPI.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Transactional
@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
}
