package com.example.ProjViewAPI.security;

import com.example.ProjViewAPI.entity.UserAccount;
import com.example.ProjViewAPI.repository.UserAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class JwtUserDetailsService implements UserDetailsService {

    private final UserAccountRepository userAccountRepository;

    @Override
    public UserAccount loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<UserAccount> user = userAccountRepository.findUserByUsername(username);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        return user.get();
    }
}