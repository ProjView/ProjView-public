package com.example.ProjViewAPI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class JiraController {

    private final JiraService jiraService;

    public JiraController(JiraService jiraService) {
        this.jiraService = jiraService;
    }

    @GetMapping("/api/oauth-callback")
    public ResponseEntity<String> oauthCallback(@RequestParam("code") String code) {
        return jiraService.getAccessToken(code);
    }

    @PostMapping("/api/refresh")
    public ResponseEntity<String> refreshToken(@RequestHeader("Authorization") String token){
        return jiraService.getRefreshToken(token);
    }
}
