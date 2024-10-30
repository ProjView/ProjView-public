package com.example.ProjViewAPI.entity;

import com.example.ProjViewAPI.POJO.AdminRegisterRequest;
import com.example.ProjViewAPI.enumeration.Role;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serial;
import java.util.Collection;
import java.util.Collections;

@Getter
@Setter
@Entity
public class Admin extends UserAccount {

    @Serial
    private static final long serialVersionUID = -8904404315417124850L;

    public Admin(AdminRegisterRequest registerRequest) {
        super(registerRequest.getUsername(), registerRequest.getPassword(), Collections.singleton(Role.ADMIN));
    }

    public Admin(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
    }

    public Admin(String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
    }

    public Admin() {
        super();
    }
}