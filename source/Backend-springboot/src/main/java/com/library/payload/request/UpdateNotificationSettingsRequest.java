package com.library.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateNotificationSettingsRequest {
    private Boolean emailEnabled;
    private Boolean pushEnabled;
    private Boolean bookRemindersEnabled;
    private Boolean dueDateAlertsEnabled;
    private Boolean newArrivalsEnabled;
    private Boolean recommendationsEnabled;
    private Boolean marketingEmailsEnabled;
    private Boolean reservationNotificationsEnabled;
    private Boolean subscriptionNotificationsEnabled;
}
