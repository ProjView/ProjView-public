package com.example.ProjViewAPI;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RedirectController {

    @Value("${spring.application.base-url}")
    private String base;

//    @RequestMapping(value = {"/", "/{path:^(?!api).*}"})
    @RequestMapping(value = {"/", "/favicon.ico", "/oauth-callback"})
    public String forwardToIndex(HttpServletRequest request) {
        String queryString = request.getQueryString(); // Extract query parameters
        String forwardPath = "forward:/index.html";
//        String redirectUrl = "http://localhost:3000/";


        if (queryString != null) {
            forwardPath += "?" + queryString; // Append query parameters if present
//            redirectUrl += "?" + queryString; // Append query parameters if present

        }

        return forwardPath; // Forward to index.html with query parameters
//        return "redirect:" + redirectUrl;

    }
}
