package com.library.exception;

import com.library.payload.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for REST API
 * Handles all exceptions thrown by controllers and provides consistent error responses
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle BookException
     */
    @ExceptionHandler(BookException.class)
    public ResponseEntity<ApiResponse> handleBookException(BookException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(ex.getMessage(),false));
    }

    /**
     * Handle UserException
     */
    @ExceptionHandler(UserException.class)
    public ResponseEntity<ApiResponse> handleUserException(UserException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(ex.getMessage(),false));
    }

    /**
     * Handle BookLoanException
     */
    @ExceptionHandler(BookLoanException.class)
    public ResponseEntity<ApiResponse> handleBookLoanException(BookLoanException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(ex.getMessage(),false));
    }

    /**
     * Handle ReservationException
     */
    @ExceptionHandler(ReservationException.class)
    public ResponseEntity<ApiResponse> handleReservationException(ReservationException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(ex.getMessage(),false));
    }

    /**
     * Handle SubscriptionPlanException
     */
    @ExceptionHandler(SubscriptionPlanException.class)
    public ResponseEntity<ApiResponse> handleSubscriptionPlanException(SubscriptionPlanException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(ex.getMessage(),false));
    }

    /**
     * Handle SubscriptionException
     */
    @ExceptionHandler(SubscriptionException.class)
    public ResponseEntity<ApiResponse> handleSubscriptionException(SubscriptionException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(ex.getMessage(),false));
    }

    /**
     * Handle PaymentException
     */
    @ExceptionHandler(PaymentException.class)
    public ResponseEntity<ApiResponse> handlePaymentException(PaymentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(ex.getMessage(),false));
    }

    /**
     * Handle GenreException
     */
    @ExceptionHandler(GenreException.class)
    public ResponseEntity<ApiResponse> handleGenreException(GenreException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(ex.getMessage(),false));
    }

    /**
     * Handle BookReviewException
     */
    @ExceptionHandler(BookReviewException.class)
    public ResponseEntity<ApiResponse> handleBookReviewException(BookReviewException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(ex.getMessage(),false));
    }

    /**
     * Handle WishlistException
     */
    @ExceptionHandler(WishlistException.class)
    public ResponseEntity<ApiResponse> handleWishlistException(WishlistException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(ex.getMessage(),false));
    }

    /**
     * Handle validation errors (from @Valid annotations)
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ValidationErrorResponse response = new ValidationErrorResponse("Validation failed", errors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handle illegal argument exceptions
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse(ex.getMessage(),false));
    }

    /**
     * Handle all other exceptions
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleGeneralException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse("An error occurred: " + ex.getMessage(),false));
    }

    /**
     * Inner class for validation error response
     */
    public static class ValidationErrorResponse {
        public String message;
        public Map<String, String> errors;

        public ValidationErrorResponse(String message, Map<String, String> errors) {
            this.message = message;
            this.errors = errors;
        }
    }
}
