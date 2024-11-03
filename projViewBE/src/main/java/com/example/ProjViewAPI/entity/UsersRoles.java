package com.example.ProjViewAPI.entity;

import com.example.ProjViewAPI.enumeration.ProjectRole;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UsersRoles {

    Set<ProjectRole> userRoles = new HashSet<>();
}
