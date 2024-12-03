package com.example.ProjViewAPI;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
public class JiraController {

    private final JiraService jiraService;

    public JiraController(JiraService jiraService) {
        this.jiraService = jiraService;
    }

    @GetMapping("/oauth-callback")
    public ResponseEntity<String> oauthCallback(@RequestParam("code") String code) {
        return jiraService.getAccessToken(code);
    }

//    @GetMapping("/oauth-callback")
//    public String oauthCallback(@RequestParam("code") String code, Model model,
//                                @RegisteredOAuth2AuthorizedClient("jira") OAuth2AuthorizedClient authorizedClient) {
//        return "prejde";
//        try {
//            // Get the access token from the authorized client
//            OAuth2AccessToken accessToken = authorizedClient.getAccessToken();
//
//            // Fetch user information or make API calls to Jira here
//            model.addAttribute("access_token", accessToken.getTokenValue());
//
//            return "redirect:/dashboard"; // or any page where you display Jira data
//
//        } catch (OAuth2AuthenticationException e) {
//            model.addAttribute("error", "Failed to authenticate");
//            return "error";
//        }
//    }

}
