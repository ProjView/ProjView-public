package com.projview.projviewbe.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {

    @RequestMapping("/{path:[^\\.]*}")
    public String forward() {
        // Forward to React's index.html for client-side routing
        return "forward:/index.html";
    }
}