package com.pulkit.fintrack.fintrack;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RootController {

    @GetMapping("/")
    public String health() {
        return "Fintrack backend is running";
    }
}