package com.library.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "email_enabled", nullable = false)
    private Boolean emailEnabled = true;

    @Column(name = "push_enabled", nullable = false)
    private Boolean pushEnabled = false;

    @Column(name = "book_reminders_enabled", nullable = false)
    private Boolean bookRemindersEnabled = true;

    @Column(name = "due_date_alerts_enabled", nullable = false)
    private Boolean dueDateAlertsEnabled = true;

    @Column(name = "new_arrivals_enabled", nullable = false)
    private Boolean newArrivalsEnabled = true;

    @Column(name = "recommendations_enabled", nullable = false)
    private Boolean recommendationsEnabled = true;

    @Column(name = "marketing_emails_enabled", nullable = false)
    private Boolean marketingEmailsEnabled = false;

    @Column(name = "reservation_notifications_enabled", nullable = false)
    private Boolean reservationNotificationsEnabled = true;

    @Column(name = "subscription_notifications_enabled", nullable = false)
    private Boolean subscriptionNotificationsEnabled = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
