package com.example.ProjViewAPI.controller;

import com.example.ProjViewAPI.POJO.UserRegisterRequest;
import com.example.ProjViewAPI.security.JwtResponseModel;
import com.example.ProjViewAPI.service.AccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
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

}
