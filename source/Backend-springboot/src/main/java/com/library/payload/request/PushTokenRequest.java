package com.library.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PushTokenRequest {

    @NotBlank(message = "Token is required")
    private String token;

    private String platform; // WEB, ANDROID, IOS
}
