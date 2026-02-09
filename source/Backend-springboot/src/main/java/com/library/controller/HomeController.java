package com.library.controller;

import com.library.payload.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping
    public ResponseEntity<ApiResponse> HomeControllerHandler() {
        
        return ResponseEntity.status(
                        HttpStatus.OK
                )
                .body(new ApiResponse(
                        "welcome to library management system!",true
                ));
    }
}
