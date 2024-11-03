package com.example.ProjViewAPI.controller;

import com.example.ProjViewAPI.exception.LoginException;
import com.example.ProjViewAPI.security.AuthenticationService;
import com.example.ProjViewAPI.security.JwtRequestModel;
import com.example.ProjViewAPI.security.JwtResponseModel;
import com.example.ProjViewAPI.service.AccountService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/login")
@RequiredArgsConstructor
@RestController
@CrossOrigin
public class JwtController {

    private final AuthenticationService authenticationService;

    private final AccountService accountService;

    @SecurityRequirement(name = "bearerAuthorization")
    @GetMapping("/isTokenValid")
    public Boolean isTokenValid() {
        return true;
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponseModel> refreshAccessToken(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader) {
        String jwtToken = authorizationHeader.substring("Bearer ".length()).trim();
        return accountService.refreshAccessToken(jwtToken);
    }

    @PostMapping
    public ResponseEntity<JwtResponseModel> login(@RequestBody JwtRequestModel request) {
        try {
            authenticationService.authenticate(request);
        } catch (LoginException e) {
            throw new LoginException(e.getMessage(), e.getStatus());
        }
        return accountService.generateJwtResponse(request.getUsername());
    }

}
