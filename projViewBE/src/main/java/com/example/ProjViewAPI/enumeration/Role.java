package com.example.ProjViewAPI.enumeration;

import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

@Getter
public enum Role implements GrantedAuthority {
    USER("ROLE_USER"),
    DEVELOPER("ROLE_DEVELOPER"),
    DEVLEAD("ROLE_DEVLEAD"),
    PROJECTMANAGER("ROLE_PROJECTMANAGER"),
    CONSULTANT("ROLE_CONSULTANT"),
    ADMIN("ROLE_ADMIN");

    private final String authority;

    Role(String authority) {
        this.authority = authority;
    }

    @Override
    public String getAuthority() {
        return authority;
    }
}
