package com.example.ProjViewAPI.controller;

import com.example.ProjViewAPI.POJO.UserRegisterRequest;
import com.example.ProjViewAPI.entity.User;
import com.example.ProjViewAPI.security.JwtResponseModel;
import com.example.ProjViewAPI.enumeration.Role;
import com.example.ProjViewAPI.service.AccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Set;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final AccountService accountService;

    @Transactional
    @SecurityRequirement(name = "bearerAuthorization")
    @DeleteMapping("/removeAuthority")
    public ResponseEntity<String> removeAuthorityFromUser(@RequestParam String username, @RequestParam Role authority) {
        accountService.removeAuthorityFromUser(username, authority);
        return ResponseEntity.ok("Authority removed successfully for user: " + username);
    }

    @Transactional
    @PostMapping("/register")
    public ResponseEntity<JwtResponseModel> registerUser(@RequestBody UserRegisterRequest registerRequest) {
        return accountService.registerUser(registerRequest);
    }

    @Transactional
    @SecurityRequirement(name = "bearerAuthorization")
    @DeleteMapping
    public void deleteUser(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        String jwtToken = authorizationHeader.substring("Bearer ".length()).trim();
        accountService.deleteUser(jwtToken);
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = accountService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/user/addAuthority")
    public ResponseEntity<String> addAuthorityToUser(@RequestParam String username, @RequestParam Role authority) {
        accountService.addAuthorityToUser(username, authority);
        return ResponseEntity.ok("Authority added successfully for user: " + username);
    }

    @GetMapping("/authorities")
    public ResponseEntity<AuthoritiesResponse> getUserAuthorities(@RequestParam String username) {
        Set<Role> authorities = accountService.getUserAuthorities(username);
        int groupNumber = calculateGroupNumber(authorities);
        AuthoritiesResponse response = new AuthoritiesResponse(authorities, groupNumber);
        return ResponseEntity.ok(response);
    }

    // Helper method to calculate the group number based on roles
    private int calculateGroupNumber(Set<Role> authorities) {
        int groupNumber = 0;
        for (Role role : authorities) {
            groupNumber += getRoleValue(role);
        }
        return groupNumber;
    }

    // Method to return the integer value of a role, fck this logic I don't care make something else if u want. I don't care enough to implement the whole Role for projects just to use 5 types.
    private int getRoleValue(Role role) {
        switch (role) {
            case USER:
                return 1;
            case DEVELOPER:
                return 2;
            case DEVLEAD:
                return 4;
            case PROJECTMANAGER:
                return 8;
            case CONSULTANT:
                return 16;
            case ADMIN:
                return 32;
            default:
                return 0; // Unknown role
        }
    }

    // Response class to hold authorities and group number
    public static class AuthoritiesResponse {
        private Set<Role> authorities;
        private int groupNumber;

        public AuthoritiesResponse(Set<Role> authorities, int groupNumber) {
            this.authorities = authorities;
            this.groupNumber = groupNumber;
        }

        public Set<Role> getAuthorities() {
            return authorities;
        }

        public int getGroupNumber() {
            return groupNumber;
        }
    }
}

