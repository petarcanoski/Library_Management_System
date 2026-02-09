package com.library.service.impl;

import com.library.domain.BookLoanStatus;
import com.library.domain.NotificationType;
import com.library.model.BookLoan;
import com.library.repository.BookLoanRepository;
import com.library.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Scheduled service for sending automated notifications
 *
 * Jobs:
 * - Due Date Alerts: Daily check for books due in 3 days or less
 * - Book Reminders: Daily reminder for active checkouts
 * - Overdue Notifications: Daily notification for overdue books
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationSchedulerService {

    private final NotificationService notificationService;
    private final BookLoanRepository bookLoanRepository;

    /**
     * Send due date alerts for books due within 3 days
     * Runs daily at 9 AM
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void sendDueDateAlerts() {
        log.info("Starting due date alerts job");

        try {
            LocalDate today = LocalDate.now();
            LocalDate threeDaysLater = today.plusDays(3);

            // Find all active loans due within next 3 days
            List<BookLoan> upcomingDueLoans = bookLoanRepository
                    .findByStatusAndDueDateBetween(
                            BookLoanStatus.CHECKED_OUT,
                            today,
                            threeDaysLater
                    );

            int sentCount = 0;
            for (BookLoan loan : upcomingDueLoans) {
                long daysUntilDue = java.time.temporal.ChronoUnit.DAYS.between(today, loan.getDueDate());

                String title = "Book Due Soon";
                String message = String.format(
                        "Your borrowed book '%s' is due in %d day%s. Please return it by %s to avoid late fees.",
                        loan.getBook().getTitle(),
                        daysUntilDue,
                        daysUntilDue == 1 ? "" : "s",
                        loan.getDueDate()
                );

                notificationService.createNotification(
                        loan.getUser(),
                        title,
                        message,
                        NotificationType.DUE_DATE_ALERT,
                        loan.getId()
                );

                sentCount++;
            }

            log.info("Due date alerts job completed. Sent {} notifications", sentCount);

        } catch (Exception e) {
            log.error("Error in due date alerts job", e);
        }
    }

    /**
     * Send reminders for active book checkouts
     * Runs daily at 10 AM
     */
    @Scheduled(cron = "0 0 10 * * *")
    public void sendBookReminders() {
        log.info("Starting book reminders job");

        try {
            // Find all active loans
            List<BookLoan> activeLoans = bookLoanRepository.findByStatus(BookLoanStatus.CHECKED_OUT);

            int sentCount = 0;
            for (BookLoan loan : activeLoans) {
                LocalDate today = LocalDate.now();
                long daysRemaining = java.time.temporal.ChronoUnit.DAYS.between(today, loan.getDueDate());

                // Send reminder if book is due within 7 days and not already sent today
                if (daysRemaining <= 7 && daysRemaining >= 0) {
                    String title = "Book Checkout Reminder";
                    String message = String.format(
                            "Reminder: You have '%s' checked out. Due date: %s (%d days remaining).",
                            loan.getBook().getTitle(),
                            loan.getDueDate(),
                            daysRemaining
                    );

                    notificationService.createNotification(
                            loan.getUser(),
                            title,
                            message,
                            NotificationType.BOOK_REMINDER,
                            loan.getId()
                    );

                    sentCount++;
                }
            }

            log.info("Book reminders job completed. Sent {} notifications", sentCount);

        } catch (Exception e) {
            log.error("Error in book reminders job", e);
        }
    }

    /**
     * Send overdue notifications for books past due date
     * Runs daily at 8 AM
     */
    @Scheduled(cron = "0 0 8 * * *")
    public void sendOverdueNotifications() {
        log.info("Starting overdue notifications job");

        try {
            // Find all overdue loans
            List<BookLoan> overdueLoans = bookLoanRepository.findByStatus(BookLoanStatus.OVERDUE);

            int sentCount = 0;
            for (BookLoan loan : overdueLoans) {
                LocalDate today = LocalDate.now();
                long daysOverdue = java.time.temporal.ChronoUnit.DAYS.between(loan.getDueDate(), today);

                String title = "Overdue Book Notice";
                String message = String.format(
                        "Your book '%s' is %d day%s overdue. Please return it immediately. " +
                        "Late fee: $%.2f. Due date was: %s",
                        loan.getBook().getTitle(),
                        daysOverdue,
                        daysOverdue == 1 ? "" : "s",
                        loan.getTotalFineAmount() ,
                        loan.getDueDate()
                );

                notificationService.createNotification(
                        loan.getUser(),
                        title,
                        message,
                        NotificationType.FINE_NOTIFICATION,
                        loan.getId()
                );

                sentCount++;
            }

            log.info("Overdue notifications job completed. Sent {} notifications", sentCount);

        } catch (Exception e) {
            log.error("Error in overdue notifications job", e);
        }
    }

    /**
     * Manual trigger for testing purposes
     * Can be called via admin endpoint if needed
     */
    public void triggerDueDateAlertsManually() {
        log.info("Manually triggering due date alerts");
        sendDueDateAlerts();
    }

    public void triggerBookRemindersManually() {
        log.info("Manually triggering book reminders");
        sendBookReminders();
    }

    public void triggerOverdueNotificationsManually() {
        log.info("Manually triggering overdue notifications");
        sendOverdueNotifications();
    }
}
