package com.library.scheduler;

import com.library.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled tasks for subscription management
 * Runs automatic subscription expiry checks
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class SubscriptionScheduler {

    private final SubscriptionService subscriptionService;

    /**
     * Deactivate expired subscriptions daily at 2 AM
     * Cron expression: "0 0 2 * * ?" = Every day at 2:00 AM
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void deactivateExpiredSubscriptions() {
        log.info("Starting scheduled subscription expiry check...");

        try {
            subscriptionService.deactivateExpiredSubscriptions();
            log.info("Scheduled subscription expiry check completed successfully");
        } catch (Exception e) {
            log.error("Error during scheduled subscription expiry check", e);
        }
    }

}
