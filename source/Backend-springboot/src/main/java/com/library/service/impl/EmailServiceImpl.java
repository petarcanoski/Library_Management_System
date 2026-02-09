package com.library.service.impl;

import com.library.payload.EmailNotificationDTO;
import com.library.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender javaMailSender;

    @Override
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setSubject(subject);
            helper.setText(body, true);
            helper.setTo(to);
            javaMailSender.send(mimeMessage);

            logger.info("Email sent successfully to: {}", to);
        } catch (MailException | MessagingException e) {
            logger.error("Failed to send email to: {}", to, e);
            throw new MailSendException("Failed to send email");
        }
    }

    @Override
    public void sendEmail(EmailNotificationDTO notification) {
        sendEmail(notification.getRecipient(), notification.getSubject(), buildSimpleBody(notification));
    }

    @Override
    public void sendTemplatedEmail(EmailNotificationDTO notification) {
        String htmlBody = buildHtmlBody(notification.getTemplateName(), notification.getTemplateData());
        sendEmail(notification.getRecipient(), notification.getSubject(), htmlBody);
    }

    @Override
    public void sendOverdueReminder(String recipient, String userName, String bookTitle,
                                   String dueDate, int overdueDays, String fineAmount) {
        String subject = "⚠️ Overdue Book Reminder - Action Required";
        String body = buildOverdueReminderHtml(userName, bookTitle, dueDate, overdueDays, fineAmount);
        sendEmail(recipient, subject, body);
    }

    @Override
    public void sendDueDateReminder(String recipient, String userName, String bookTitle,
                                   String dueDate, int daysUntilDue) {
        String subject = "📚 Book Due Date Reminder - " + bookTitle;
        String body = buildDueDateReminderHtml(userName, bookTitle, dueDate, daysUntilDue);
        sendEmail(recipient, subject, body);
    }

    // ==================== HELPER METHODS ====================

    private String buildSimpleBody(EmailNotificationDTO notification) {
        if (notification.getTemplateData() != null && notification.getTemplateData().containsKey("message")) {
            return notification.getTemplateData().get("message").toString();
        }
        return "";
    }

    private String buildHtmlBody(String templateName, Object templateData) {
        // In production, use a template engine like Thymeleaf or FreeMarker
        // For now, return basic HTML
        return "<html><body><p>Template: " + templateName + "</p></body></html>";
    }

    private String buildOverdueReminderHtml(String userName, String bookTitle, String dueDate,
                                           int overdueDays, String fineAmount) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #dc3545; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                    .content { background-color: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; }
                    .alert { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
                    .book-info { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                    .fine { color: #dc3545; font-weight: bold; font-size: 1.2em; }
                    .footer { margin-top: 20px; font-size: 0.9em; color: #6c757d; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>⚠️ Overdue Book Reminder</h2>
                    </div>
                    <div class="content">
                        <p>Dear %s,</p>

                        <div class="alert">
                            <strong>Action Required:</strong> You have an overdue book that needs to be returned immediately.
                        </div>

                        <div class="book-info">
                            <h3>Book Details:</h3>
                            <p><strong>Title:</strong> %s</p>
                            <p><strong>Due Date:</strong> %s</p>
                            <p><strong>Days Overdue:</strong> %d days</p>
                        </div>

                        <div class="alert">
                            <p class="fine">Current Fine: %s</p>
                            <p><small>Fines continue to accrue daily until the book is returned.</small></p>
                        </div>

                        <p><strong>What to do next:</strong></p>
                        <ul>
                            <li>Return the book to the library as soon as possible</li>
                            <li>Pay the accumulated fine at the library desk</li>
                            <li>Contact us if you have any questions or concerns</li>
                        </ul>

                        <div class="footer">
                            <p>Thank you for your cooperation.</p>
                            <p><strong>Library Management Team</strong></p>
                            <p><small>This is an automated message. Please do not reply to this email.</small></p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(userName, bookTitle, dueDate, overdueDays, fineAmount);
    }

    private String buildDueDateReminderHtml(String userName, String bookTitle, String dueDate, int daysUntilDue) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #0d6efd; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                    .content { background-color: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; }
                    .info { background-color: #d1ecf1; border-left: 4px solid #0dcaf0; padding: 15px; margin: 15px 0; }
                    .book-info { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                    .footer { margin-top: 20px; font-size: 0.9em; color: #6c757d; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>📚 Book Due Date Reminder</h2>
                    </div>
                    <div class="content">
                        <p>Dear %s,</p>

                        <div class="info">
                            <strong>Friendly Reminder:</strong> You have a book that will be due soon.
                        </div>

                        <div class="book-info">
                            <h3>Book Details:</h3>
                            <p><strong>Title:</strong> %s</p>
                            <p><strong>Due Date:</strong> %s</p>
                            <p><strong>Days Until Due:</strong> %d day(s)</p>
                        </div>

                        <p><strong>Options:</strong></p>
                        <ul>
                            <li>Return the book before the due date to avoid fines</li>
                            <li>Renew the book online if you need more time (subject to renewal limits)</li>
                            <li>Visit the library to extend your checkout period</li>
                        </ul>

                        <div class="footer">
                            <p>Thank you for using our library!</p>
                            <p><strong>Library Management Team</strong></p>
                            <p><small>This is an automated message. Please do not reply to this email.</small></p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(userName, bookTitle, dueDate, daysUntilDue);
    }

    @Override
    public void sendReservationAvailableNotification(String recipient, String userName, String bookTitle,
                                                    String availableUntil, int holdPeriodHours) {
        String subject = "🎉 Your Reserved Book is Now Available - " + bookTitle;
        String body = buildReservationAvailableHtml(userName, bookTitle, availableUntil, holdPeriodHours);
        sendEmail(recipient, subject, body);
    }

    private String buildReservationAvailableHtml(String userName, String bookTitle,
                                                String availableUntil, int holdPeriodHours) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #28a745; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                    .content { background-color: #f8f9fa; padding: 20px; border-radius: 0 0 5px 5px; }
                    .success { background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; }
                    .book-info { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                    .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; }
                    .deadline { color: #dc3545; font-weight: bold; font-size: 1.1em; }
                    .footer { margin-top: 20px; font-size: 0.9em; color: #6c757d; }
                    .cta-button { background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 15px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h2>🎉 Your Reserved Book is Available!</h2>
                    </div>
                    <div class="content">
                        <p>Dear %s,</p>

                        <div class="success">
                            <strong>Great news!</strong> The book you reserved is now available for pickup.
                        </div>

                        <div class="book-info">
                            <h3>Book Details:</h3>
                            <p><strong>Title:</strong> %s</p>
                        </div>

                        <div class="warning">
                            <p><strong>⏰ Important:</strong> Please pick up this book within <strong>%d hours</strong>.</p>
                            <p class="deadline">Pickup Deadline: %s</p>
                            <p><small>If not picked up by this date, your reservation will expire and the book will be made available to the next person in the queue.</small></p>
                        </div>

                        <p><strong>Next Steps:</strong></p>
                        <ul>
                            <li>Visit the library to pick up your reserved book</li>
                            <li>Bring your library card or ID</li>
                            <li>Ask the librarian for your reserved book</li>
                        </ul>

                        <p><strong>Library Hours:</strong></p>
                        <ul>
                            <li>Monday - Friday: 9:00 AM - 8:00 PM</li>
                            <li>Saturday - Sunday: 10:00 AM - 6:00 PM</li>
                        </ul>

                        <div class="footer">
                            <p>We look forward to seeing you!</p>
                            <p><strong>Library Management Team</strong></p>
                            <p><small>This is an automated message. Please do not reply to this email.</small></p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(userName, bookTitle, holdPeriodHours, availableUntil);
    }
}
