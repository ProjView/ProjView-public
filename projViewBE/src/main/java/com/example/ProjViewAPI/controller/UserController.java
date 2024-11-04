package com.example.ProjViewAPI.controller;

import com.example.ProjViewAPI.entity.User;
import com.example.ProjViewAPI.security.JwtRequestModel;
import com.example.ProjViewAPI.security.JwtResponseModel;
import com.example.ProjViewAPI.service.AccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//@CrossOrigin(allowedHeaders = "*", origins = "*")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final AccountService accountService;

    @Transactional
    @PostMapping("/register")
    public ResponseEntity<JwtResponseModel> registerUser(@RequestBody JwtRequestModel jwtRequestModel) {
        return accountService.registerUser(jwtRequestModel);
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


//    @GetMapping("/authorities")
//    public ResponseEntity<AuthoritiesResponse> getUserAuthorities(@RequestParam String username) {
//        Set<Role> authorities = accountService.getUserAuthorities(username);
//        int groupNumber = calculateGroupNumber(authorities);
//        AuthoritiesResponse response = new AuthoritiesResponse(authorities, groupNumber);
//        return ResponseEntity.ok(null);
//    }
}

