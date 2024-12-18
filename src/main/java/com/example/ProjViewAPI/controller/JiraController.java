package com.example.ProjViewAPI.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ProjViewAPI.service.JiraService;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api") // Base path for the Jira API
public class JiraController {

    private final JiraService jiraService;

    public JiraController(JiraService jiraService) {
        this.jiraService = jiraService;
    }

    // OAuth callback for Jira service
    @GetMapping("/oauth-callback")
    public ResponseEntity<String> oauthCallback(@RequestParam("code") String code,
                                                @RequestParam("source") String source) {
        return jiraService.getAccessToken(code, source);
    }

    // Refresh token for Jira service
    @PostMapping("/refresh")
    public ResponseEntity<String> refreshToken(@RequestHeader("Authorization") String token,
                                               @RequestParam("source") String source) {
        return jiraService.getRefreshToken(token, source);
    }
}
