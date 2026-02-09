package com.library.service;

import com.library.domain.NotificationType;
import com.library.exception.UserException;
import com.library.model.Notification;
import com.library.model.User;
import com.library.payload.dto.NotificationDTO;
import org.springframework.data.domain.Page;

/**
 * Service interface for managing book loan notifications and user notifications
 */
public interface NotificationService {

    // ==================== BOOK LOAN NOTIFICATION METHODS ====================

    /**
     * Send overdue notifications to all users with overdue books
     * @return Number of notifications sent
     */
    int sendOverdueNotifications();

    /**
     * Send due date reminders for books due within N days
     * @param daysBeforeDue Days before due date to send reminder
     * @return Number of notifications sent
     */
    int sendDueDateReminders(int daysBeforeDue);

    /**
     * Send overdue notification for a specific book loan
     * @param bookLoanId Book loan ID
     * @throws com.library.exception.BookLoanException if book loan not found
     */
    void sendOverdueNotification(Long bookLoanId);

    /**
     * Send due date reminder for a specific book loan
     * @param bookLoanId Book loan ID
     * @throws com.library.exception.BookLoanException if book loan not found
     */
    void sendDueDateReminder(Long bookLoanId);

    // ==================== USER NOTIFICATION METHODS ====================

    /**
     * Get all notifications for a user (paginated)
     * @param user The user to fetch notifications for
     * @param page Page information
     * @return Page of notification DTOs
     */
    Page<NotificationDTO> getUserNotifications(User user, int page, int size);

    /**
     * Get unread notifications for a user (paginated)
     * @param user The user to fetch unread notifications for
     * @param pageable Pagination information
     * @return Page of unread notification DTOs
     */
//    Page<NotificationDTO> getUnreadNotifications(User user, Pageable pageable);

    /**
     * Get count of unread notifications for a user
     * @param user The user to count unread notifications for
     * @return Count of unread notifications
     */
    Long getUnreadCount(User user);

    /**
     * Mark a notification as read
     * @param notificationId The notification ID
     * @param user The user who owns the notification
     * @return Updated notification DTO
     * @throws UserException if notification not found or doesn't belong to user
     */
    NotificationDTO markAsRead(Long notificationId, User user) throws UserException;

    /**
     * Mark all notifications as read for a user
     * @param user The user to mark all notifications as read for
     */
    void markAllAsRead(User user);

    /**
     * Delete a notification
     * @param notificationId The notification ID to delete
     * @param user The user who owns the notification
     * @throws UserException if notification not found or doesn't belong to user
     */
    void deleteNotification(Long notificationId, User user) throws UserException;

    /**
     * Delete all notifications for a user
     * @param user The user to delete all notifications for
     */
    void deleteAllNotifications(User user);

    /**
     * Create a new notification
     * @param user The user to send notification to
     * @param title Notification title
     * @param message Notification message
     * @param type Notification type
     * @param relatedEntityId ID of related entity (optional)
     * @return Created notification
     */
    Notification createNotification(User user, String title, String message,
                                   NotificationType type, Long relatedEntityId);

    /**
     * Get a notification by ID (with user verification)
     * @param user The user to verify ownership
     * @param notificationId The notification ID
     * @return The notification
     * @throws UserException if notification not found or doesn't belong to user
     */
    Notification getNotificationById(User user, Long notificationId) throws UserException;
}
