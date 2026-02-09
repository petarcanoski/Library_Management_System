package com.library.payload.request;

import com.library.domain.DeliveryMethod;
import com.library.domain.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateNotificationRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Title is required")
    private String title;

    private String message;

    @NotNull(message = "Notification type is required")
    private NotificationType type;

    private Long relatedEntityId;

    private DeliveryMethod deliveryMethod = DeliveryMethod.IN_APP;
}
