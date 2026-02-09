package com.library.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

/**
 * DTO for email notification details
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailNotificationDTO {

    private String recipient;
    private String subject;
    private String templateName;
    private Map<String, Object> templateData;

    public EmailNotificationDTO(String recipient, String subject) {
        this.recipient = recipient;
        this.subject = subject;
    }
}
