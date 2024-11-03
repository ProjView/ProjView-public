package com.example.ProjViewAPI.entity;

import com.example.ProjViewAPI.POJO.UserRegisterRequest;
import com.example.ProjViewAPI.enumeration.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.Collections;
import java.util.Set;

@Getter
@Setter
@Entity
public class User extends UserAccount {

    @ManyToMany(mappedBy = "users", fetch = FetchType.EAGER)
    private Set<Project> projects;

    public User(UserRegisterRequest registerRequest) {
        super(registerRequest.getUsername(), registerRequest.getPassword(), Collections.singleton(Role.USER));
    }

    public User() {
        super();
    }
    public void setAuthorities(Set<Role> authorities) {
        this.authorities = authorities;
    }
}

