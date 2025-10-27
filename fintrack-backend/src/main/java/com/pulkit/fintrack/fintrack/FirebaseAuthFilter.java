package com.pulkit.fintrack.fintrack;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class FirebaseAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(FirebaseAuthFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String origin = request.getHeader("Origin");
        if (origin != null) {
            // Always add CORS headers early
            response.setHeader("Access-Control-Allow-Origin", origin);
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Origin");
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.setHeader("Vary", "Origin");
        }

        // ✅ Let preflight OPTIONS requests pass without auth
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendUnauthorized(response, "missing_or_invalid_authorization", "Authorization header missing or invalid");
            return;
        }

        String idToken = authHeader.substring("Bearer ".length()).trim();

        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            request.setAttribute("uid", decodedToken.getUid());

            log.debug("Authenticated request from UID={} for path={}", decodedToken.getUid(), request.getRequestURI());
            filterChain.doFilter(request, response);

        } catch (Exception ex) {
            log.debug("Firebase token verification failed: {}", ex.getMessage());
            sendUnauthorized(response, "invalid_or_expired_token", "The provided token is invalid or expired");
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Only guard API routes
        return path == null || !path.startsWith("/api/");
    }

    private void sendUnauthorized(HttpServletResponse res, String code, String message) throws IOException {
        res.setStatus(HttpStatus.UNAUTHORIZED.value());
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setContentType("application/json");
        res.getWriter().write(String.format("{\"error\":\"%s\",\"message\":\"%s\"}", code, message));
    }
}
