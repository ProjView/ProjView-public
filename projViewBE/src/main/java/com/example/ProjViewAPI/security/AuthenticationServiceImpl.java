package com.example.ProjViewAPI.security;

import com.example.ProjViewAPI.exception.LoginException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final PasswordEncoder passwordEncoder;

    private final JwtUserDetailsService userDetailsService;

    public AuthenticationServiceImpl(PasswordEncoder passwordEncoder, JwtUserDetailsService userDetailsService) {
        this.passwordEncoder = passwordEncoder;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void authenticate(JwtRequestModel request) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        if (!userDetails.isEnabled()) {
            throw new LoginException("User is disabled", 401);
        }
        if (!userDetails.isAccountNonExpired()) {
            throw new LoginException("This account has expired", 401);
        }
        if (!userDetails.isAccountNonLocked()) {
            throw new LoginException("This account is locked", 401);
        }
        if (!userDetails.isCredentialsNonExpired()) {
            throw new LoginException("Credential for this account has expired", 401);
        }
        if (!passwordEncoder.matches(request.getPassword(), userDetails.getPassword())) {
            throw new LoginException("Password is incorrect", 401);
        }
    }


}
