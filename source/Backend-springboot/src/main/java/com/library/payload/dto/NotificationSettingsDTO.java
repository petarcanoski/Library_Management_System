package com.library.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationSettingsDTO {
    private Long id;
    private Long userId;
    private Boolean emailEnabled;
    private Boolean pushEnabled;
    private Boolean bookRemindersEnabled;
    private Boolean dueDateAlertsEnabled;
    private Boolean newArrivalsEnabled;
    private Boolean recommendationsEnabled;
    private Boolean marketingEmailsEnabled;
    private Boolean reservationNotificationsEnabled;
    private Boolean subscriptionNotificationsEnabled;
    private LocalDateTime updatedAt;
}
