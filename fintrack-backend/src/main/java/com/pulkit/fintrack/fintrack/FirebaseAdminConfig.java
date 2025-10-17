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

import java.io.InputStream;

@Configuration
public class FirebaseAdminConfig {

    private static final Logger log = LoggerFactory.getLogger(FirebaseAdminConfig.class);

    @Value("${app.firebase.project-id:fintrack-c20ca}")
    private String projectId; // must match token aud/iss

    @PostConstruct
    public void init() throws Exception {
        if (!FirebaseApp.getApps().isEmpty()) {
            log.info("Firebase already initialized. Skipping reinitialization.");
            return;
        }

        try {
            ClassPathResource res = new ClassPathResource("serviceAccountKey.json");
            if (res.exists()) {
                try (InputStream in = res.getInputStream()) {
                    FirebaseOptions opts = FirebaseOptions.builder()
                            .setCredentials(GoogleCredentials.fromStream(in))
                            .setProjectId(projectId)
                            .build();
                    FirebaseApp.initializeApp(opts);
                    log.info("Firebase initialized using service account for project {}", projectId);
                    return;
                }
            }

            // Fallback to ADC (Application Default Credentials)
            FirebaseOptions opts = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.getApplicationDefault())
                    .setProjectId(projectId)
                    .build();
            FirebaseApp.initializeApp(opts);
            log.info("Firebase initialized using ADC for project {}", projectId);

        } catch (Exception e) {
            log.error("Failed to initialize Firebase. Check credentials and project ID.", e);
            throw e;
        }
    }
}