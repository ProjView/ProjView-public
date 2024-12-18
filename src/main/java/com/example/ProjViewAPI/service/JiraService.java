package com.example.ProjViewAPI.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class JiraService {

    private final String clientIdNxt;
    private final String clientSecretNxt;
    private final String redirectUriNxt;

    private final String clientIdTuke;
    private final String clientSecretTuke;
    private final String redirectUriTuke;

    private final HttpClient client;

    @Autowired
    public JiraService(
            @Value("${spring.security.oauth2.client.registration.jira.client-id}") String clientIdNxt,
            @Value("${spring.security.oauth2.client.registration.jira.client-secret}") String clientSecretNxt,
            @Value("${spring.security.oauth2.client.registration.jira.redirect-uri}") String redirectUriNxt,
            @Value("${spring.security.oauth2.client.registration.jira.client-id.tuke}") String clientIdTuke,
            @Value("${spring.security.oauth2.client.registration.jira.client-secret.tuke}") String clientSecretTuke,
            @Value("${spring.security.oauth2.client.registration.jira.redirect-uri}") String redirectUriTuke) {
        
        this.clientIdNxt = clientIdNxt;
        this.clientSecretNxt = clientSecretNxt;
        this.redirectUriNxt = redirectUriNxt;

        this.clientIdTuke = clientIdTuke;
        this.clientSecretTuke = clientSecretTuke;
        this.redirectUriTuke = redirectUriTuke;

        this.client = HttpClient.newHttpClient();
    }

    public ResponseEntity<String> getAccessToken(String code, String source) {
        String httpUrl = "https://auth.atlassian.com/oauth/token";
        String clientId = source.equalsIgnoreCase("tuke") ? clientIdTuke : clientIdNxt;
        String clientSecret = source.equalsIgnoreCase("tuke") ? clientSecretTuke : clientSecretNxt;
        String redirectUri = source.equalsIgnoreCase("tuke") ? redirectUriTuke : redirectUriNxt;

        String bodyString = "{ \"grant_type\": \"authorization_code\", " +
                "\"client_id\": \"" + clientId + "\", " +
                "\"client_secret\": \"" + clientSecret + "\", " +
                "\"code\": \"" + code + "\", " +
                "\"redirect_uri\": \"" + redirectUri + "\" }";
        
        HttpRequest request = HttpRequest
                .newBuilder()
                .uri(URI.create(httpUrl))
                .version(HttpClient.Version.HTTP_2)
                .timeout(Duration.ofMinutes(1))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(bodyString))
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return ResponseEntity.ok(response.body());
        } catch (IOException | InterruptedException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    public ResponseEntity<String> getRefreshToken(String token, String source) {
        String httpUrl = "https://auth.atlassian.com/oauth/token";
        String clientId = source.equalsIgnoreCase("tuke") ? clientIdTuke : clientIdNxt;
        String clientSecret = source.equalsIgnoreCase("tuke") ? clientSecretTuke : clientSecretNxt;

        String bodyString = "{ \"grant_type\": \"refresh_token\", " +
                "\"client_id\": \"" + clientId + "\", " +
                "\"client_secret\": \"" + clientSecret + "\", " +
                "\"refresh_token\": \"" + token + "\"}";

        HttpRequest request = HttpRequest
                .newBuilder()
                .uri(URI.create(httpUrl))
                .version(HttpClient.Version.HTTP_2)
                .timeout(Duration.ofMinutes(1))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(bodyString))
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return ResponseEntity.status(response.statusCode()).body(response.body());
        } catch (IOException | InterruptedException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
