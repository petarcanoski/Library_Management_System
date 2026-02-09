package com.library.mapper;

import com.library.model.NotificationSettings;
import com.library.payload.dto.NotificationSettingsDTO;
import org.springframework.stereotype.Component;

@Component
public class NotificationSettingsMapper {

    public static NotificationSettingsDTO toDTO(NotificationSettings settings) {
        if (settings == null) {
            return null;
        }

        return NotificationSettingsDTO.builder()
                .id(settings.getId())
                .userId(settings.getUser() != null ? settings.getUser().getId() : null)
                .emailEnabled(settings.getEmailEnabled())
                .pushEnabled(settings.getPushEnabled())
                .bookRemindersEnabled(settings.getBookRemindersEnabled())
                .dueDateAlertsEnabled(settings.getDueDateAlertsEnabled())
                .newArrivalsEnabled(settings.getNewArrivalsEnabled())
                .recommendationsEnabled(settings.getRecommendationsEnabled())
                .marketingEmailsEnabled(settings.getMarketingEmailsEnabled())
                .reservationNotificationsEnabled(settings.getReservationNotificationsEnabled())
                .subscriptionNotificationsEnabled(settings.getSubscriptionNotificationsEnabled())
                .updatedAt(settings.getUpdatedAt())
                .build();
    }
}
