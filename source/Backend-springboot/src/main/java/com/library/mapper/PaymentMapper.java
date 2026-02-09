package com.library.mapper;

import com.library.model.Payment;
import com.library.model.User;
import com.library.model.BookLoan;
import com.library.model.Subscription;
import com.library.payload.dto.PaymentDTO;
import com.library.repository.UserRepository;
import com.library.repository.BookLoanRepository;
import com.library.repository.SubscriptionRepository;
import com.library.exception.PaymentException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper for converting between Payment entity and PaymentDTO
 */
@Component
@RequiredArgsConstructor
public class PaymentMapper {

    private final UserRepository userRepository;
    private final BookLoanRepository bookLoanRepository;
    private final SubscriptionRepository subscriptionRepository;

    /**
     * Convert Payment entity to PaymentDTO
     */
    public PaymentDTO toDTO(Payment payment) {
        if (payment == null) {
            return null;
        }

        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());

        // User information
        if (payment.getUser() != null) {
            dto.setUserId(payment.getUser().getId());
            dto.setUserName(payment.getUser().getFullName());
            dto.setUserEmail(payment.getUser().getEmail());
        }

        // Book loan information
        if (payment.getBookLoan() != null) {
            dto.setBookLoanId(payment.getBookLoan().getId());
        }

        // Subscription information
        if (payment.getSubscription() != null) {
            dto.setSubscriptionId(payment.getSubscription().getId());
        }

        dto.setPaymentType(payment.getPaymentType());
        dto.setStatus(payment.getStatus());
        dto.setGateway(payment.getGateway());
        dto.setAmount(payment.getAmount());
        dto.setCurrency(payment.getCurrency());
        dto.setTransactionId(payment.getTransactionId());
        dto.setGatewayPaymentId(payment.getGatewayPaymentId());
        dto.setGatewayOrderId(payment.getGatewayOrderId());
        dto.setGatewaySignature(payment.getGatewaySignature());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setDescription(payment.getDescription());
        dto.setFailureReason(payment.getFailureReason());
        dto.setRetryCount(payment.getRetryCount());
        dto.setInitiatedAt(payment.getInitiatedAt());
        dto.setCompletedAt(payment.getCompletedAt());
        dto.setNotificationSent(payment.getNotificationSent());
        dto.setActive(payment.getActive());
        dto.setCreatedAt(payment.getCreatedAt());
        dto.setUpdatedAt(payment.getUpdatedAt());

        return dto;
    }

    /**
     * Convert PaymentDTO to Payment entity
     */
    public Payment toEntity(PaymentDTO dto) throws PaymentException {
        if (dto == null) {
            return null;
        }

        Payment payment = new Payment();
        payment.setId(dto.getId());

        // Map user
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new PaymentException("User with ID " + dto.getUserId() + " not found"));
            payment.setUser(user);
        }

        // Map book loan if provided
        if (dto.getBookLoanId() != null) {
            BookLoan bookLoan = bookLoanRepository.findById(dto.getBookLoanId())
                .orElseThrow(() -> new PaymentException("Book loan with ID " + dto.getBookLoanId() + " not found"));
            payment.setBookLoan(bookLoan);
        }

        // Map subscription if provided
        if (dto.getSubscriptionId() != null) {
            Subscription subscription = subscriptionRepository.findById(dto.getSubscriptionId())
                .orElseThrow(() -> new PaymentException("Subscription with ID " + dto.getSubscriptionId() + " not found"));
            payment.setSubscription(subscription);
        }

        payment.setPaymentType(dto.getPaymentType());
        payment.setStatus(dto.getStatus());
        payment.setGateway(dto.getGateway());
        payment.setAmount(dto.getAmount());
        payment.setCurrency(dto.getCurrency());
        payment.setTransactionId(dto.getTransactionId());
        payment.setGatewayPaymentId(dto.getGatewayPaymentId());
        payment.setGatewayOrderId(dto.getGatewayOrderId());
        payment.setGatewaySignature(dto.getGatewaySignature());
        payment.setPaymentMethod(dto.getPaymentMethod());
        payment.setDescription(dto.getDescription());
        payment.setFailureReason(dto.getFailureReason());
        payment.setRetryCount(dto.getRetryCount() != null ? dto.getRetryCount() : 0);
        payment.setInitiatedAt(dto.getInitiatedAt());
        payment.setCompletedAt(dto.getCompletedAt());
        payment.setNotificationSent(dto.getNotificationSent() != null ? dto.getNotificationSent() : false);
        payment.setActive(dto.getActive() != null ? dto.getActive() : true);

        return payment;
    }

    /**
     * Convert list of Payment entities to list of PaymentDTOs
     */
    public List<PaymentDTO> toDTOList(List<Payment> payments) {
        if (payments == null) {
            return null;
        }
        return payments.stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }
}
