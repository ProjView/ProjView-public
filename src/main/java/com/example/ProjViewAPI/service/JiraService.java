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

    private final String clientId;

    private final String clientSecret;

    private final String redirectUri;

    private final HttpClient client;

    @Autowired
    public JiraService(@Value("${spring.security.oauth2.client.registration.jira.client-id}") String clientId,
                       @Value("${spring.security.oauth2.client.registration.jira.client-secret}") String clientSecret,
                       @Value("${spring.security.oauth2.client.registration.jira.redirect-uri}") String redirectUri) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.client = HttpClient.newHttpClient();
    }

    public ResponseEntity<String> getAccessToken(String code) {
        String httpUrl = "https://auth.atlassian.com/oauth/token";
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

    public ResponseEntity<String> getRefreshToken(String token) {
        String httpUrl = "https://auth.atlassian.com/oauth/token";
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
//            return ResponseEntity.ok(response.body());
        } catch (IOException | InterruptedException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
