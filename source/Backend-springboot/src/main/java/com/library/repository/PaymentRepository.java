package com.library.repository;

import com.library.model.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository interface for Payment entity.
 * Provides CRUD operations and custom query methods for payment transactions.
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    /**
     * Find payment by transaction ID
     */
    Optional<Payment> findByTransactionId(String transactionId);

    /**
     * Find all payments for a user
     */
    Page<Payment> findByUserIdAndActiveTrue(Long userId, Pageable pageable);









}
