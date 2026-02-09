package com.library.service.impl;

import com.library.mapper.NotificationSettingsMapper;
import com.library.model.NotificationSettings;
import com.library.model.User;
import com.library.payload.dto.NotificationSettingsDTO;
import com.library.payload.request.UpdateNotificationSettingsRequest;
import com.library.repository.NotificationSettingsRepository;
import com.library.service.NotificationSettingsService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Implementation of NotificationSettingsService interface.
 * Handles notification settings management for users.
 */
@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class NotificationSettingsServiceImpl implements NotificationSettingsService {

    private final NotificationSettingsRepository notificationSettingsRepository;

    @Override
    public NotificationSettingsDTO getSettings(User user) {
        log.debug("Fetching notification settings for user: {}", user.getEmail());
        NotificationSettings settings = notificationSettingsRepository
                .findByUser(user).orElse(null);
        return NotificationSettingsMapper.toDTO(settings);

    }

    @Override
    public NotificationSettings getOrCreateSettings(User user) {
        log.debug("Fetching or creating notification settings for user: {}", user.getEmail());
        return notificationSettingsRepository.findByUser(user)
                .orElseGet(() -> createDefaultSettings(user));
    }

    @Override
    public NotificationSettingsDTO updateSettings(User user, UpdateNotificationSettingsRequest request) {
        log.info("Updating notification settings for user: {}", user.getEmail());

        NotificationSettings settings = getOrCreateSettings(user);

        // Update only non-null fields from the request
        if (request.getEmailEnabled() != null) {
            settings.setEmailEnabled(request.getEmailEnabled());
        }
        if (request.getPushEnabled() != null) {
            settings.setPushEnabled(request.getPushEnabled());
        }
        if (request.getBookRemindersEnabled() != null) {
            settings.setBookRemindersEnabled(request.getBookRemindersEnabled());
        }
        if (request.getDueDateAlertsEnabled() != null) {
            settings.setDueDateAlertsEnabled(request.getDueDateAlertsEnabled());
        }
        if (request.getNewArrivalsEnabled() != null) {
            settings.setNewArrivalsEnabled(request.getNewArrivalsEnabled());
        }
        if (request.getRecommendationsEnabled() != null) {
            settings.setRecommendationsEnabled(request.getRecommendationsEnabled());
        }
        if (request.getMarketingEmailsEnabled() != null) {
            settings.setMarketingEmailsEnabled(request.getMarketingEmailsEnabled());
        }
        if (request.getReservationNotificationsEnabled() != null) {
            settings.setReservationNotificationsEnabled(request.getReservationNotificationsEnabled());
        }
        if (request.getSubscriptionNotificationsEnabled() != null) {
            settings.setSubscriptionNotificationsEnabled(request.getSubscriptionNotificationsEnabled());
        }

        NotificationSettings savedSettings = notificationSettingsRepository.save(settings);
        log.info("Successfully updated notification settings for user: {}", user.getEmail());

        return NotificationSettingsMapper.toDTO(savedSettings);
    }

    @Override
    public NotificationSettings createDefaultSettings(User user) {
        log.info("Creating default notification settings for user: {}", user.getEmail());

        NotificationSettings settings = NotificationSettings.builder()
                .user(user)
                .emailEnabled(true)
                .pushEnabled(false)
                .bookRemindersEnabled(true)
                .dueDateAlertsEnabled(true)
                .newArrivalsEnabled(true)
                .recommendationsEnabled(true)
                .marketingEmailsEnabled(false)
                .reservationNotificationsEnabled(true)
                .subscriptionNotificationsEnabled(true)
                .build();

        NotificationSettings savedSettings = notificationSettingsRepository.save(settings);
        log.info("Successfully created default notification settings for user: {}", user.getEmail());

        return savedSettings;
    }
}
