package com.example.ProjViewAPI.enumeration;

import lombok.Getter;

@Getter
public enum ProjectRole {

    USER("ROLE_USER"),

    DEVELOPER("ROLE_DEVELOPER"),

    DEVLEAD("ROLE_DEVLEAD"),

    PROJECTMANAGER("ROLE_PROJECTMANAGER"),

    CONSULTANT("ROLE_CONSULTANT"),

    ADMIN("ROLE_ADMIN");


    private final String projectRole;

    ProjectRole(String projectRole){
        this.projectRole = projectRole;
    }
}
