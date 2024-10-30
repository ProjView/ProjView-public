package com.example.ProjViewAPI.entity;

import com.example.ProjViewAPI.POJO.UserRegisterRequest;
import com.example.ProjViewAPI.enumeration.Role;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.util.Collections;

@Getter
@Setter
@Entity
public class User extends UserAccount {

//    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
//    private Set<Project> projects;

    public User(UserRegisterRequest registerRequest) {
        super(registerRequest.getUsername(), registerRequest.getPassword(), Collections.singleton(Role.USER));
    }

    public User() {
        super();
    }
}

