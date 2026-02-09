package com.library.controller;

import com.library.service.impl.BookLoanServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final BookLoanServiceImpl bookLoanServiceImpl;

    @GetMapping("/test/mark-overdue")
    public ResponseEntity<?> testMarkOverdue() {
        int count = bookLoanServiceImpl.updateOverdueBookLoans();
        return ResponseEntity.ok("Updated " + count + " overdue loans");
    }
}
