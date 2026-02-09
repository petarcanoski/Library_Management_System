package com.library.service;

import com.library.payload.EmailNotificationDTO;

/**
 * Service interface for sending email notifications
 */
public interface EmailService {

    /**
     * Send a simple email notification
     * @param to Recipient email
     * @param subject Email subject
     * @param body Email body
     */
    void sendEmail(String to, String subject, String body);

    /**
     * Send a simple email notification
     * @param notification Email notification details
     */
    void sendEmail(EmailNotificationDTO notification);

    /**
     * Send an HTML email with template
     * @param notification Email notification with template data
     */
    void sendTemplatedEmail(EmailNotificationDTO notification);

    /**
     * Send overdue reminder email
     * @param recipient User email
     * @param userName User name
     * @param bookTitle Book title
     * @param dueDate Due date
     * @param overdueDays Number of days overdue
     * @param fineAmount Current fine amount
     */
    void sendOverdueReminder(String recipient, String userName, String bookTitle,
                            String dueDate, int overdueDays, String fineAmount);

    /**
     * Send due date reminder email (before due date)
     * @param recipient User email
     * @param userName User name
     * @param bookTitle Book title
     * @param dueDate Due date
     * @param daysUntilDue Days until due
     */
    void sendDueDateReminder(String recipient, String userName, String bookTitle,
                            String dueDate, int daysUntilDue);

    /**
     * Send reservation available notification
     * @param recipient User email
     * @param userName User name
     * @param bookTitle Book title
     * @param availableUntil Pickup deadline
     * @param holdPeriodHours Hours book will be held
     */
    void sendReservationAvailableNotification(String recipient, String userName, String bookTitle,
                                             String availableUntil, int holdPeriodHours);
}
