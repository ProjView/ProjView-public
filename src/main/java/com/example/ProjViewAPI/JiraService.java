package com.example.ProjViewAPI;

import com.example.ProjViewAPI.dto.TokenResp;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.util.Map;

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
//            ObjectMapper mapper = new ObjectMapper();
//            Map<String, TokenResp> map = mapper.readValue(response.body(), Map.class);
//
//            TokenResp tokenResp = new TokenResp(
//                    map.get("access_token").toString(),
//                    map.get("expires_in").toString(),
//                    map.get("token_type").toString(),
//                    map.get("scope").toString()
//            );
            return ResponseEntity.ok(response.body());
        } catch (IOException | InterruptedException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }


    }
}
