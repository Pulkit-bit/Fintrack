package com.pulkit.fintrack.fintrack;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;

@Configuration
public class FirebaseAdminConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseAdminConfig.class);

    @Value("${app.firebase.project-id:fintrack-c20ca}")
    private String projectId;

    @PostConstruct
    public void init() throws Exception {
        if (!FirebaseApp.getApps().isEmpty()) {
            log.info("Firebase already initialized. Skipping reinitialization.");
            return;
        }

        // Try Render secret path FIRST
        String renderSecretPath = "/etc/secrets/serviceAccountKey.json";
        File keyFile = new File(renderSecretPath);
        if (keyFile.exists()) {
            try (InputStream in = new FileInputStream(keyFile)) {
                FirebaseOptions opts = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(in))
                        .setProjectId(projectId)
                        .build();
                FirebaseApp.initializeApp(opts);
                log.info("Firebase initialized using Render's secret file: {}", renderSecretPath);
                return;
            }
        }

        // Try local development resource path as fallback
        try {
            ClassPathResource res = new ClassPathResource("serviceAccountKey.json");
            if (res.exists()) {
                try (InputStream in = res.getInputStream()) {
                    FirebaseOptions opts = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(in))
                            .setProjectId(projectId)
                            .build();
                    FirebaseApp.initializeApp(opts);
                    log.info("Firebase initialized using local resource: serviceAccountKey.json for project {}", projectId);
                    return;
                }
            }
        } catch (Exception e) {
            log.warn("Local resource serviceAccountKey.json not found or failed to load", e);
        }

        // Final fallback: Application Default Credentials (not recommended for prod)
        FirebaseOptions opts = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.getApplicationDefault())
                .setProjectId(projectId)
                .build();
        FirebaseApp.initializeApp(opts);
        log.info("Firebase initialized using Application Default Credentials for project {}", projectId);
    }
}
