package com.library.event.listener;

import com.library.domain.PaymentType;
import com.library.event.PaymentSuccessEvent;
import com.library.exception.SubscriptionException;
import com.library.service.FineService;
import com.library.service.SubscriptionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class PaymentEventListener {
//
//    private final FineService fineService;
//    private final SubscriptionService subscriptionService;
//
//
//    @Async
//    @EventListener
//    @Transactional
//    public void handlePaymentSuccess(PaymentSuccessEvent event)
//            throws SubscriptionException {
//        log.info("Received PaymentSuccessEvent: paymentId={}, type={}, amount={}",
//                event.getPaymentId(), event.getPaymentType(), event.getAmount());
//
//        switch (event.getPaymentType()) {
//            case FINE:
//            case DAMAGED_BOOK_PENALTY:
//            case LOST_BOOK_PENALTY:
//                fineService.markFineAsPaid(
//                        event.getFineId(),
//                        event.getAmount(),
//                        event.getTransactionId()
//                );
//                break;
//
//            case MEMBERSHIP:
//                subscriptionService.activateSubscription(event.getSubscriptionId(), event.getPaymentId());
//                break;
//
//            default:
//                log.warn("Unhandled payment type: {}", event.getPaymentType());
//        }
//    }
//}

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentEventListener {

    private final SubscriptionService subscriptionService;

    @EventListener
    @Transactional
    public void handlePaymentSuccess(PaymentSuccessEvent event) throws SubscriptionException {

        if (event.getPaymentType() != PaymentType.MEMBERSHIP) {
            return;
        }

        if (event.getUserId() == null || event.getSubscriptionId() == null) {
            return;
        }

        log.info("Handling Stripe payment success for user {}",
                event.getUserId());

        subscriptionService.createSubscriptionFromStripe(
                event.getUserId(),
                event.getPlanId()   // we add this to the event
        );
    }
}

