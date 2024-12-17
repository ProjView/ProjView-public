package com.example.ProjViewAPI.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ProjViewAPI.service.JiraService;
import com.example.ProjViewAPI.service.JiraServiceTuke;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class JiraController {

    private final JiraService jiraService;
    private final JiraServiceTuke jiraServiceTuke;

    public JiraController(JiraService jiraService, JiraServiceTuke jiraServiceTuke) {
        this.jiraService = jiraService;
        this.jiraServiceTuke = jiraServiceTuke;
    }

    // OAuth callback for standard Jira service
    @GetMapping("/api/oauth-callback")
    public ResponseEntity<String> oauthCallback(@RequestParam("code") String code) {
        return jiraService.getAccessToken(code);
    }

    // Refresh token for standard Jira service
    @PostMapping("/api/refresh")
    public ResponseEntity<String> refreshToken(@RequestHeader("Authorization") String token) {
        return jiraService.getRefreshToken(token);
    }

    // OAuth callback for Tuke Jira service
    @GetMapping("/api/oauth-callback-tuke")
    public ResponseEntity<String> oauthCallbackTuke(@RequestParam("code") String code) {
        return jiraServiceTuke.getAccessToken(code);
    }

    // Refresh token for Tuke Jira service
    @PostMapping("/api/refresh-tuke")
    public ResponseEntity<String> refreshTokenTuke(@RequestHeader("Authorization") String token) {
        return jiraServiceTuke.getRefreshToken(token);
    }
}
