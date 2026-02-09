package com.library.scheduler;

import com.library.service.BookLoanService;
import com.library.service.NotificationService;
import com.library.service.ReservationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled tasks for book loan operations.
 * Automatically updates overdue book loans, calculates fines, and sends notifications.
 */
@Component
public class BookLoanScheduler {

    private static final Logger logger = LoggerFactory.getLogger(BookLoanScheduler.class);
    private static final int DUE_DATE_REMINDER_DAYS = 3; // Send reminder 3 days before due date

    private final BookLoanService bookLoanService;
    private final NotificationService notificationService;
    private final ReservationService reservationService;

    public BookLoanScheduler(BookLoanService bookLoanService,
                            NotificationService notificationService,
                            ReservationService reservationService) {
        this.bookLoanService = bookLoanService;
        this.notificationService = notificationService;
        this.reservationService = reservationService;
    }

    /**
     * Scheduled task to mark overdue book loans and calculate fines.
     * Runs every midnight (00:00:00).
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void markOverdueLoans() {
        logger.info("Starting scheduled task: marking overdue book loans");

        try {
            int updatedCount = bookLoanService.updateOverdueBookLoans();
            logger.info("Successfully marked {} book loan(s) as overdue", updatedCount);
        } catch (Exception e) {
            logger.error("Error occurred while marking overdue book loans", e);
        }
    }

    /**
     * Scheduled task to send overdue notifications.
     * Runs every day at 9:00 AM.
     */
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendOverdueNotifications() {
        logger.info("Starting scheduled task: sending overdue notifications");

        try {
            int notificationsSent = notificationService.sendOverdueNotifications();
            logger.info("Successfully sent {} overdue notification(s)", notificationsSent);
        } catch (Exception e) {
            logger.error("Error occurred while sending overdue notifications", e);
        }
    }

    /**
     * Scheduled task to send due date reminders.
     * Runs every day at 10:00 AM.
     * Sends reminders for books due in 3 days.
     */
    @Scheduled(cron = "0 0 10 * * ?")
    public void sendDueDateReminders() {
        logger.info("Starting scheduled task: sending due date reminders");

        try {
            int notificationsSent = notificationService.sendDueDateReminders(DUE_DATE_REMINDER_DAYS);
            logger.info("Successfully sent {} due date reminder(s)", notificationsSent);
        } catch (Exception e) {
            logger.error("Error occurred while sending due date reminders", e);
        }
    }

    /**
     * Scheduled task to expire old reservations.
     * Runs every 6 hours.
     * Expires reservations that passed their pickup deadline.
     */
    @Scheduled(cron = "0 0 */6 * * ?")
    public void expireOldReservations() {
        logger.info("Starting scheduled task: expiring old reservations");

        try {
            int expiredCount = reservationService.expireOldReservations();
            logger.info("Successfully expired {} reservation(s)", expiredCount);
        } catch (Exception e) {
            logger.error("Error occurred while expiring old reservations", e);
        }
    }
}
