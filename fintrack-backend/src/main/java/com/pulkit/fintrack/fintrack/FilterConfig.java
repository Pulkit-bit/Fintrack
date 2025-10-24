package com.pulkit.fintrack.fintrack;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration // Spring automatically detects and uses this configuration
public class FilterConfig {

    @Bean // Registered dynamically by Spring Boot at runtime
    public FilterRegistrationBean<FirebaseAuthFilter> firebaseAuthFilterRegistration() {
        FilterRegistrationBean<FirebaseAuthFilter> reg = new FilterRegistrationBean<>();
        reg.setFilter(new FirebaseAuthFilter());
        reg.addUrlPatterns("/api/*");  // protect API only
        reg.setOrder(1);               // early in chain
        return reg;
    }
}
