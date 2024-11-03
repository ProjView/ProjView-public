package com.example.ProjViewAPI.controller;

import com.example.ProjViewAPI.POJO.LoginResponse;
import com.example.ProjViewAPI.entity.UserAccount;
import com.example.ProjViewAPI.enumeration.Role;
import com.example.ProjViewAPI.exception.LoginException;
import com.example.ProjViewAPI.security.AuthenticationService;
import com.example.ProjViewAPI.security.JwtRequestModel;
import com.example.ProjViewAPI.security.JwtUserDetailsService;
import com.example.ProjViewAPI.security.TokenManager;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/api/login")
@RestController
//@CrossOrigin(allowedHeaders = "*", origins = "*")
public class JwtController {

    private final JwtUserDetailsService userDetailsService;

    private final AuthenticationService authenticationService;

    private final TokenManager tokenManager;

    public JwtController(JwtUserDetailsService userDetailsService, AuthenticationManager authenticationManager,
                         TokenManager tokenManager, AuthenticationService authenticationService) {
        this.userDetailsService = userDetailsService;
        this.tokenManager = tokenManager;
        this.authenticationService = authenticationService;
    }

    @SecurityRequirement(name = "bearerAuthorization")
    @GetMapping("/isTokenValid")
    public Boolean isTokenValid(@RequestHeader(HttpHeaders.AUTHORIZATION) String authorizationHeader){
        return true;
    }

    @PostMapping
    public ResponseEntity<LoginResponse> createToken(@RequestBody JwtRequestModel request) {
        try {
            authenticationService.authenticate(request);
        } catch (LoginException e) {
            throw new LoginException(e.getMessage(), e.getStatus());
        }
        final UserAccount userAccount = userDetailsService.loadUserByUsername(request.getUsername());
        final String jwtToken = tokenManager.generateJwtToken(userAccount);
        return ResponseEntity.status(HttpStatus.OK).body(new LoginResponse(
                jwtToken,
                userAccount.getAuthorities().contains(Role.ADMIN)));
    }

}
