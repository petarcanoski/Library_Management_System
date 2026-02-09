package com.library.config;

import com.library.service.ReservationService;
import com.library.service.impl.BookLoanServiceImpl;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

/**
 * Configuration class for service dependencies
 * Handles circular dependency between BookLoanService and ReservationService
 */
@Configuration
public class ServiceConfiguration {

    private final BookLoanServiceImpl bookLoanService;
    private final ReservationService reservationService;

    public ServiceConfiguration(BookLoanServiceImpl bookLoanService,
                                ReservationService reservationService) {
        this.bookLoanService = bookLoanService;
        this.reservationService = reservationService;
    }

    @PostConstruct
    public void init() {
        // Set ReservationService in BookLoanService after construction
        bookLoanService.setReservationService(reservationService);
    }
}
