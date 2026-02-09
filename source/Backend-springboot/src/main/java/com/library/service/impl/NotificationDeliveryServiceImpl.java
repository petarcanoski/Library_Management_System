package com.library.service.impl;

import com.library.model.Notification;
import com.library.model.NotificationSettings;
import com.library.model.PushToken;
import com.library.model.User;
import com.library.repository.PushTokenRepository;
import com.library.service.NotificationDeliveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementation of NotificationDeliveryService interface.
 * Handles delivery of notifications through various channels (email, push, in-app).
 *
 * Note: Email and push implementations are currently logging only.
 * Actual email service (e.g., SendGrid, AWS SES) and push service (e.g., FCM)
 * can be integrated later.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationDeliveryServiceImpl implements NotificationDeliveryService {

    private final PushTokenRepository pushTokenRepository;

    @Override
    public void deliverNotification(Notification notification, NotificationSettings settings) {
        log.debug("Delivering notification {} to user {}", notification.getId(), notification.getUser().getEmail());

        // Always save in-app notification (already saved before this is called)
        log.debug("In-app notification saved for user: {}", notification.getUser().getEmail());

        // Deliver via email if enabled
        if (settings.getEmailEnabled() && shouldSendEmail(notification, settings)) {
            try {
                sendEmail(notification.getUser(), notification.getTitle(), notification.getMessage());
            } catch (Exception e) {
                log.error("Failed to send email notification to user {}: {}",
                         notification.getUser().getEmail(), e.getMessage());
            }
        }

        // Deliver via push if enabled
        if (settings.getPushEnabled() && shouldSendPush(notification, settings)) {
            try {
                sendPush(notification.getUser(), notification.getTitle(), notification.getMessage());
            } catch (Exception e) {
                log.error("Failed to send push notification to user {}: {}",
                         notification.getUser().getEmail(), e.getMessage());
            }
        }
    }

    @Override
    public void sendEmail(User user, String title, String message) {
        // TODO: Integrate actual email service (SendGrid, AWS SES, JavaMail, etc.)
        log.info("EMAIL NOTIFICATION - To: {}, Subject: {}, Message: {}",
                 user.getEmail(), title, message);

        // Example integration points:
        // 1. SendGrid: sendGridService.send(user.getEmail(), title, message);
        // 2. AWS SES: sesService.sendEmail(user.getEmail(), title, message);
        // 3. JavaMail: mailSender.send(createMimeMessage(user.getEmail(), title, message));
    }

    @Override
    public void sendPush(User user, String title, String message) {
        // Get active push tokens for the user
        List<PushToken> activeTokens = pushTokenRepository.findByUserAndIsActiveTrue(user);

        if (activeTokens.isEmpty()) {
            log.debug("No active push tokens found for user: {}", user.getEmail());
            return;
        }

        // TODO: Integrate actual push notification service (FCM, APNs, etc.)
        log.info("PUSH NOTIFICATION - User: {}, Tokens: {}, Title: {}, Message: {}",
                 user.getEmail(), activeTokens.size(), title, message);

        // Example integration points:
        // 1. Firebase Cloud Messaging:
        //    for (PushToken token : activeTokens) {
        //        fcmService.send(token.getToken(), title, message);
        //    }
        // 2. AWS SNS: snsService.sendPush(activeTokens, title, message);
        // 3. OneSignal: oneSignalService.sendNotification(activeTokens, title, message);

        for (PushToken token : activeTokens) {
            log.debug("Would send push to token: {} ({})",
                     token.getToken().substring(0, Math.min(20, token.getToken().length())) + "...",
                     token.getPlatform());
        }
    }

    /**
     * Helper method to determine if email should be sent based on notification type and settings
     */
    private boolean shouldSendEmail(Notification notification, NotificationSettings settings) {
        // Check notification type against specific settings
        return switch (notification.getType()) {
            case DUE_DATE_ALERT -> settings.getDueDateAlertsEnabled();
            case BOOK_REMINDER -> settings.getBookRemindersEnabled();
            case NEW_ARRIVAL -> settings.getNewArrivalsEnabled();
            case RECOMMENDATION -> settings.getRecommendationsEnabled();
            case MARKETING -> settings.getMarketingEmailsEnabled();
            case RESERVATION_AVAILABLE -> settings.getReservationNotificationsEnabled();
            case SUBSCRIPTION_EXPIRING -> settings.getSubscriptionNotificationsEnabled();
            case FINE_NOTIFICATION -> true; // Always send fine notifications
            case BOOK_RETURNED -> settings.getBookRemindersEnabled();
            case SYSTEM_NOTIFICATION -> true; // Always send system notifications
        };
    }

    /**
     * Helper method to determine if push should be sent based on notification type and settings
     */
    private boolean shouldSendPush(Notification notification, NotificationSettings settings) {
        // Use same logic as email for consistency
        return shouldSendEmail(notification, settings);
    }
}
