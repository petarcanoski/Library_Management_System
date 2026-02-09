package com.library.event.publisher;

import com.library.event.PaymentFailedEvent;
import com.library.event.PaymentInitiatedEvent;
import com.library.event.PaymentSuccessEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

/**
 * Publisher for payment-related domain events.
 * Uses Spring's ApplicationEventPublisher to broadcast events to listeners.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventPublisher {

    private final ApplicationEventPublisher applicationEventPublisher;

    /**
     * Publish a payment initiated event.
     * All registered listeners will receive this event asynchronously.
     *
     * @param event The payment initiated event to publish
     */
    public void publishPaymentInitiated(PaymentInitiatedEvent event) {
        log.info("Publishing PaymentInitiatedEvent for payment ID: {}, type: {}",
            event.getPaymentId(), event.getPaymentType());

        applicationEventPublisher.publishEvent(event);

        log.debug("PaymentInitiatedEvent published successfully for payment ID: {}",
            event.getPaymentId());
    }

    /**
     * Publish a payment success event.
     * All registered listeners will receive this event asynchronously.
     *
     * @param event The payment success event to publish
     */
    public void publishPaymentSuccess(PaymentSuccessEvent event) {
        log.info("Publishing PaymentSuccessEvent for payment ID: {}, type: {}",
            event.getPaymentId(), event.getPaymentType());

        applicationEventPublisher.publishEvent(event);

        log.debug("PaymentSuccessEvent published successfully for payment ID: {}",
            event.getPaymentId());
    }

    /**
     * Publish a payment failed event.
     * All registered listeners will receive this event asynchronously.
     *
     * @param event The payment failed event to publish
     */
    public void publishPaymentFailed(PaymentFailedEvent event) {
        log.info("Publishing PaymentFailedEvent for payment ID: {}, type: {}, reason: {}",
            event.getPaymentId(), event.getPaymentType(), event.getFailureReason());

        applicationEventPublisher.publishEvent(event);

        log.debug("PaymentFailedEvent published successfully for payment ID: {}",
            event.getPaymentId());
    }
}
