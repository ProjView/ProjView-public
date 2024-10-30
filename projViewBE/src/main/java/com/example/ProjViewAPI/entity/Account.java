package com.example.ProjViewAPI.entity;

import com.example.ProjViewAPI.enumeration.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;

import java.io.Serial;
import java.util.Collection;
import java.util.Collections;

@Getter
@Entity
public abstract class Account extends UserAccount {

    @Serial
    private static final long serialVersionUID = 1117115951948925946L;

    @Id
    @GeneratedValue
    private Long id;

    public Account(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
    }

    public Account(String username, String password, boolean enabled, boolean accountNonExpired, boolean credentialsNonExpired, boolean accountNonLocked, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, enabled, accountNonExpired, credentialsNonExpired, accountNonLocked, authorities);
    }

    public Account() {
        super(null, null, Collections.singleton(Role.USER));
    }
}