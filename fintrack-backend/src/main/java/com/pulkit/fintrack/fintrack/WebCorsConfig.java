package com.pulkit.fintrack.fintrack;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class WebCorsConfig {

    @Value("${frontend.url:http://localhost:5173,https://fintrack-frontend-e5b6.onrender.com}")
    private String allowedOriginsProp;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        // Split and clean allowed origins from application.properties
        final String[] allowedOrigins = Arrays.stream(allowedOriginsProp.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toArray(String[]::new);

        // Confirm config bean loaded
        System.out.println("🔥 [WebCorsConfig] Bean created successfully");
        System.out.println("🔥 [WebCorsConfig] Allowed origins → " + Arrays.toString(allowedOrigins));

        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(allowedOrigins)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*") // accept all headers for simplicity
                        .exposedHeaders("Authorization")
                        .allowCredentials(true)
                        .maxAge(3600);

                System.out.println("✅ [WebCorsConfig] CORS mappings applied successfully.");
            }
        };
    }
}
